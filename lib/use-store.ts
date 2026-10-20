'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { emptyState, stateSchema, type AppState } from './model';
const responseSchema = z.object({ state: stateSchema, revision: z.number().int().nonnegative() });
export function useStore() {
  const [state, setState] = useState<AppState>(emptyState);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(0);
  const [sessionExpired, setSessionExpired] = useState(false);
  const revision = useRef(0);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const blocked = useRef(true);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setReady(false);
      setError('');
      try {
        const response = await fetch('/api/state', { cache: 'no-store' });
        if (response.status === 401 && !cancelled) setSessionExpired(true);
        if (!response.ok)
          throw new Error(
            response.status === 401
              ? 'Your session has expired. Sign in again to open your records.'
              : 'Your records could not be loaded. Check your connection and try again.',
          );
        const data = responseSchema.parse(await response.json());
        if (!cancelled) {
          revision.current = data.revision;
          blocked.current = false;
          setState(data.state);
          setReady(true);
        }
      } catch (cause) {
        if (!cancelled)
          setError(
            cause instanceof Error && !(cause instanceof z.ZodError)
              ? cause.message
              : 'Your records could not be loaded. Please try again.',
          );
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!pending && !(ready && error)) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [pending, ready, error]);
  const commit = useCallback(
    (next: AppState) => {
      if (!ready) return false;
      const validated = stateSchema.safeParse(next);
      if (!validated.success) {
        setError(
          'That change could not be saved. Check the entered values or export your data if a record limit was reached.',
        );
        return false;
      }
      if (blocked.current) {
        setError(
          'Saving is paused after an error. Export your changes, then reload before importing them.',
        );
        return false;
      }
      setState(validated.data);
      setPending((n) => n + 1);
      queue.current = queue.current
        .then(async () => {
          if (blocked.current) return;
          try {
            const response = await fetch('/api/state', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ state: validated.data, revision: revision.current }),
            });
            const result = await response.json().catch(() => null);
            if (response.status === 401) setSessionExpired(true);
            if (
              !response.ok ||
              !result ||
              !Number.isInteger(result.revision) ||
              result.revision < 0
            )
              throw new Error(
                response.status === 401
                  ? 'Your session has expired. Export your changes, then sign in again.'
                  : result?.error || 'Saving failed. Export your changes before leaving.',
              );
            revision.current = result.revision;
            setError('');
          } catch (cause) {
            blocked.current = true;
            setError(
              cause instanceof Error
                ? cause.message
                : 'Saving failed. Export your changes before leaving.',
            );
          }
        })
        .finally(() => setPending((n) => n - 1));
      return true;
    },
    [ready],
  );
  return { state, commit, ready, error, pending, sessionExpired };
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
