import { describe, expect, it } from 'vitest';
import {
  emptyState,
  addDog,
  updateDog,
  parseBackup,
  progressFor,
  recordSession,
  nextPractice,
  remainingSeconds,
  occurrences,
  localDay,
  type CalendarEvent,
} from '../lib/model';
import { lessons } from '../lib/lessons';
import { tips, tipGroups } from '../lib/tips';
import { references } from '../lib/references';
import { requireOwner } from '../lib/cloud';
import { practice, profile, sampleState } from './fixtures';
describe('profiles and backups', () => {
  it('creates a dog only when the confirmation action runs', () => {
    const original = emptyState();
    expect(original.dogs).toHaveLength(0);
    const confirmed = addDog(original, profile);
    expect(confirmed.dogs[0].name).toBe('Maple');
    expect(original.dogs).toHaveLength(0);
  });
  it('edits one dog without touching another', () => {
    const state = addDog(sampleState(), { ...profile, id: crypto.randomUUID(), name: 'Poppy' });
    const edited = updateDog(state, profile.id, (d) => ({ ...d, name: 'Maple Bean' }));
    expect(edited.dogs.map((d) => d.name)).toEqual(['Maple Bean', 'Poppy']);
  });
  it('round-trips dog records, observations, events and favorites', () => {
    const state = recordSession(sampleState(), profile.id, practice(20));
    state.favorites = [tips[0].id];
    expect(parseBackup(JSON.stringify(state))).toEqual(state);
  });
  it('rejects malformed, duplicate and disconnected backup records', () => {
    expect(() => parseBackup('{}')).toThrow();
    const state = sampleState();
    state.dogs.push(state.dogs[0]);
    expect(() => parseBackup(JSON.stringify(state))).toThrow();
    expect(() =>
      parseBackup(JSON.stringify({ ...sampleState(), activeDogId: crypto.randomUUID() })),
    ).toThrow();
  });
  it('rejects script-bearing photos, oversized backups and invalid dates', () => {
    expect(() =>
      parseBackup(
        JSON.stringify({
          ...sampleState(),
          dogs: [{ ...sampleState().dogs[0], photo: 'javascript:alert(1)' }],
        }),
      ),
    ).toThrow();
    expect(() => parseBackup(' '.repeat(8_000_001))).toThrow();
    const state = recordSession(
      sampleState(),
      profile.id,
      practice(20, { finishedAt: 'tomorrow' }),
    );
    expect(() => parseBackup(JSON.stringify(state))).toThrow();
  });
});
describe('observed foundation and maintenance', () => {
  it('gives no progress for timer completion without observed success', () => {
    expect(progressFor([practice(20, { observed: false })], 'calm-at-home').percent).toBe(0);
  });
  it('does not advance from difficult or partial sessions', () => {
    expect(
      progressFor(
        [practice(20, { outcome: 'difficult' }), practice(21, { outcome: 'progress' })],
        'calm-at-home',
      ).percent,
    ).toBe(0);
  });
  it('credits distinct same-day sessions and ignores repeated ids', () => {
    const first = practice(20);
    expect(progressFor([first, first, practice(20)], 'calm-at-home').percent).toBe(33);
  });
  it('requires six confirmed sessions across sequential milestones', () => {
    const sessions = Array.from({ length: 6 }, (_, i) =>
      practice(20 + i, { milestone: Math.floor(i / 2) }),
    );
    expect(progressFor(sessions, 'calm-at-home')).toEqual({
      percent: 100,
      milestone: 3,
      successes: 6,
      complete: true,
    });
    expect(progressFor([...sessions, practice(27, { milestone: 3 })], 'calm-at-home').percent).toBe(
      100,
    );
  });
  it('does not credit out-of-order milestones or another lesson', () => {
    expect(
      progressFor(
        [practice(20, { milestone: 2 }), practice(21, { lessonId: 'trade-it' })],
        'calm-at-home',
      ).percent,
    ).toBe(0);
  });
  it('records feedback once with a computed progress snapshot', () => {
    const session = practice(20);
    const state = recordSession(
      recordSession(sampleState(), profile.id, session),
      profile.id,
      session,
    );
    expect(state.dogs[0].sessions).toHaveLength(1);
    expect(state.dogs[0].sessions[0].progressSnapshot).toBe(17);
  });
  it('suggests rest after difficulty and weekly optional maintenance', () => {
    const now = new Date(2026, 9, 20, 10);
    expect(localDay(nextPractice('difficult', false, now))).toBe('2026-10-22');
    expect(localDay(nextPractice('great', false, now))).toBe('2026-10-21');
    expect(localDay(nextPractice('great', true, now))).toBe('2026-10-27');
  });
});
describe('wall-clock timer', () => {
  it('continues accurately after a background-tab delay', () => {
    expect(remainingSeconds(160000, 60, 145200)).toBe(15);
    expect(remainingSeconds(160000, 60, 200000)).toBe(0);
  });
  it('keeps paused time stable and rounds up', () => {
    expect(remainingSeconds(null, 43, 9999999)).toBe(43);
    expect(remainingSeconds(1001, 10, 1000)).toBe(1);
  });
});
describe('calendar recurrence', () => {
  const event: CalendarEvent = {
    id: crypto.randomUUID(),
    title: 'Practice',
    kind: 'Training',
    start: new Date(2026, 0, 31, 10).toISOString(),
    repeat: 'monthly',
    timeZone: 'Atlantic/Reykjavik',
    notes: '',
  };
  it('clamps short months without drifting the original date', () => {
    const dates = occurrences([event], new Date(2026, 0, 1), new Date(2026, 3, 1)).map((e) =>
      localDay(e.occurrence),
    );
    expect(dates).toEqual(['2026-01-31', '2026-02-28', '2026-03-31']);
  });
  it('does not include events outside the visible range', () => {
    expect(
      occurrences([{ ...event, repeat: 'none' }], new Date(2026, 1, 1), new Date(2026, 2, 1)),
    ).toEqual([]);
  });
  it('retains local wall-clock time for weekly reinforcement', () => {
    const dates = occurrences(
      [{ ...event, start: new Date(2026, 2, 1, 10).toISOString(), repeat: 'weekly' }],
      new Date(2026, 2, 1),
      new Date(2026, 2, 16),
    );
    expect(dates).toHaveLength(3);
    expect(dates.every((e) => new Date(e.occurrence).getHours() === 10)).toBe(true);
  });
  it('handles yearly leap-day reminders', () => {
    const dates = occurrences(
      [{ ...event, start: new Date(2024, 1, 29, 10).toISOString(), repeat: 'yearly' }],
      new Date(2025, 0, 1),
      new Date(2025, 11, 31),
    );
    expect(localDay(dates[0].occurrence)).toBe('2025-02-28');
  });
});
describe('content and owner checks', () => {
  it('includes the original foundation and expanded skill lessons with supporting guidance', () => {
    expect(lessons.filter((lesson) => lesson.level === 'Foundation')).toHaveLength(15);
    expect(lessons.filter((lesson) => lesson.level !== 'Foundation')).toHaveLength(20);
    expect(new Set(lessons.map((l) => l.category)).size).toBe(9);
    for (const lesson of lessons) {
      expect(lesson.steps).toHaveLength(3);
      for (const step of lesson.steps) {
        expect(step.seconds).toBeGreaterThan(0);
        expect(step.success.length).toBeGreaterThan(20);
      }
      for (const source of lesson.sources) expect(references[source].url).toMatch(/^https:\/\//);
      expect(lesson.evidence).toContain('not a separately validated');
    }
  });
  it('has the expanded unique tip catalog in all sixteen groups', () => {
    expect(tips.length).toBeGreaterThanOrEqual(160);
    expect(new Set(tips.map((t) => t.text)).size).toBe(tips.length);
    expect(Object.keys(tipGroups)).toHaveLength(16);
  });
  it('requires a session owner', () => {
    expect(() => requireOwner(null)).toThrow('Authentication required');
    expect(requireOwner('alice')).toBe('alice');
  });
});
