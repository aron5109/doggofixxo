'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { emptyState, parseBackup, stateSchema, STORAGE_KEY, type AppState } from './model';
export function useStore(mode: 'demo' | 'cloud') {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(0);
  const revision = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const blocked = useRef(false);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setReady(false);
      setError('');
      blocked.current = false;
      try {
        let loaded: AppState;
        if (mode === 'demo') {
          const raw = localStorage.getItem(STORAGE_KEY);
          loaded = raw ? parseBackup(raw) : emptyState();
        } else {
          const response = await fetch('/api/state', { cache: 'no-store' });
          if (!response.ok)
            throw new Error('Cloud records could not be loaded. Check your connection and reload.');
          const data = await response.json();
          loaded = stateSchema.parse(data.state);
          revision.current = data.revision;
        }
        if (!cancelled) {
          setState(loaded);
          setReady(true);
        }
      } catch {
        if (!cancelled)
          setError(
            mode === 'demo'
              ? 'Your saved data could not be read. It has not been overwritten. Export the original backup below or import a valid backup.'
              : 'Cloud records could not be loaded. Check your connection and reload.',
          );
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [mode]);
  useEffect(() => {
    if (mode !== 'cloud' || (!pending && !error)) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [mode, pending, error]);
  const commit = useCallback(
    (next: AppState) => {
      const validated = stateSchema.safeParse(next);
      if (!validated.success) {
        setError(
          'That change could not be saved. Check the entered values or export your data if a record limit was reached.',
        );
        return false;
      }
      if (mode === 'demo') {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          setError(
            'This browser could not save the change. Export a backup and check available storage.',
          );
          return false;
        }
        setState(next);
        setReady(true);
        setError('');
        return true;
      }
      if (blocked.current) {
        setError(
          'Cloud saving is paused after an error. Export your changes, then reload before importing them.',
        );
        return false;
      }
      setState(next);
      setPending((n) => n + 1);
      queue.current = queue.current
        .then(async () => {
          if (blocked.current) return;
          try {
            const response = await fetch('/api/state', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ state: next, revision: revision.current }),
            });
            const result = await response.json().catch(() => null);
            if (!response.ok || !result)
              throw new Error(
                result?.error || 'Cloud saving failed. Export your changes before leaving.',
              );
            revision.current = result.revision;
            setError('');
          } catch (cause) {
            blocked.current = true;
            setError(
              cause instanceof Error
                ? cause.message
                : 'Cloud saving failed. Export your changes before leaving.',
            );
          }
        })
        .finally(() => setPending((n) => n - 1));
      return true;
    },
    [mode],
  );
  return { state, commit, ready, error, pending };
}
export function downloadBackup(state: AppState | string, filename = 'mellowoof-backup.json') {
  const url = URL.createObjectURL(
    new Blob([typeof state === 'string' ? state : JSON.stringify(state, null, 2)], {
      type: 'application/json',
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
