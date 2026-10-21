import { describe, expect, it } from 'vitest';
import {
  addDog,
  emptyState,
  updateDog,
  stateSchema,
  parseBackup,
  occurrences,
  recordSession,
  progressFor,
  progressAtSession,
  localDay,
  type CalendarEvent,
} from '../lib/model';
import {
  careEstimates,
  makeCareEvents,
  replaceCarePlan,
  togglePlayOccurrence,
  dogBadges,
  playChart,
  ageInYears,
} from '../lib/care';
import { sampleState, profile, practice } from './fixtures';

const dog = () => sampleState().dogs[0];
const options = {
  day: '2026-03-07',
  times: ['08:00', '18:00'],
  repeat: true,
  weeks: 6,
  minutes: 30,
};
describe('care estimates and backward compatible profiles', () => {
  it('loads unchanged existing accounts with no care fields', () => {
    const original = sampleState();
    expect(parseBackup(JSON.stringify(original))).toEqual(original);
    expect(careEstimates(original.dogs[0]).grams).toBeGreaterThan(0);
    expect(playChart([], 'Week', new Date(2026, 9, 21)).every((b) => b.minutes === 0)).toBe(true);
  });
  it('converts pounds to kilograms before estimating food and water', () => {
    const kg = careEstimates({ ...dog(), weight: 10 });
    const lb = careEstimates({ ...dog(), weight: 10 / 0.45359237, unit: 'lb' });
    expect(lb.kcal).toBe(kg.kcal);
    expect(lb.grams).toBe(kg.grams);
    expect(lb.waterLow).toBe(500);
    expect(lb.waterHigh).toBe(600);
  });
  it('accounts for age, activity and the actual food energy density', () => {
    const base = dog();
    expect(careEstimates({ ...base, activityLevel: 'High' }).kcal).toBeGreaterThan(
      careEstimates({ ...base, activityLevel: 'Low' }).kcal,
    );
    expect(careEstimates({ ...base, age: 0.5 }).kcal).toBeGreaterThan(careEstimates(base).kcal);
    expect(
      Math.abs(
        careEstimates({ ...base, foodKcalPer100g: 200 }).grams -
          careEstimates({ ...base, foodKcalPer100g: 400 }).grams * 2,
      ),
    ).toBeLessThanOrEqual(1);
    expect(careEstimates({ ...base, age: 0.05 }).suitable).toBe(false);
    expect(
      ageInYears({ ...base, birthday: '2024-10-21' }, new Date('2026-10-21T12:00:00Z')),
    ).toBeCloseTo(2, 1);
  });
  it('creates one birthday series, updates it, and removes it when the profile date is cleared', () => {
    let state = addDog(emptyState(), {
      ...profile,
      birthday: '2024-02-29',
      microchip: '123456789012345',
    });
    const first = state.dogs[0].events[0];
    expect(first).toMatchObject({ kind: 'Birthday', repeat: 'yearly', carePlan: 'birthday' });
    const dates = occurrences([first], new Date(2026, 0, 1), new Date(2028, 11, 31));
    expect(dates.map((e) => localDay(e.occurrence))).toEqual([
      '2026-02-28',
      '2027-02-28',
      '2028-02-29',
    ]);
    state = updateDog(state, profile.id, (d) => ({ ...d, name: 'Maple Bean' }));
    expect(state.dogs[0].events).toHaveLength(1);
    expect(state.dogs[0].events[0].id).toBe(first.id);
    expect(state.dogs[0].events[0].title).toBe('Maple Bean’s birthday');
    expect(parseBackup(JSON.stringify(state))).toEqual(state);
    state = updateDog(state, profile.id, (d) => ({ ...d, birthday: undefined }));
    expect(state.dogs[0].events).toEqual([]);
  });
});
describe('confirmed compact calendar plans', () => {
  it('stores two series for a year of feeding, preserves local meal times across DST, and stops at the end', () => {
    const events = makeCareEvents(dog(), 'feeding', options);
    expect(events).toHaveLength(2);
    const dates = occurrences(events, new Date(2026, 2, 7), new Date(2027, 2, 7));
    expect(dates).toHaveLength(730);
    expect(dates.every((e) => [8, 18].includes(new Date(e.occurrence).getHours()))).toBe(true);
    expect(dates.at(-1)!.occurrence < new Date(2027, 2, 7).toISOString()).toBe(true);
    expect(events[0].notes).toContain('Approx.');
  });
  it('supports six-week bathing check-ins and single manual appointments', () => {
    const baths = makeCareEvents(dog(), 'bathing', { ...options, times: ['10:00'] });
    expect(baths[0]).toMatchObject({ kind: 'Grooming', repeat: 'weekly', repeatEvery: 6 });
    expect(occurrences(baths, new Date(2026, 2, 7), new Date(2027, 2, 7))).toHaveLength(9);
    const manual = makeCareEvents(dog(), 'feeding', { ...options, repeat: false });
    expect(
      occurrences(
        manual.map((event) => ({ ...event, repeatUntil: '2025-01-01T00:00:00Z' })),
        new Date(2026, 2, 7),
        new Date(2026, 2, 8),
      ),
    ).toHaveLength(2);
    expect(manual.every((e) => e.repeat === 'none' && !e.carePlan && !e.repeatUntil)).toBe(true);
    expect(() =>
      makeCareEvents(dog(), 'feeding', { ...options, times: ['08:00', '08:00'] }),
    ).toThrow();
    expect(() => makeCareEvents(dog(), 'feeding', { ...options, day: '2026-02-30' })).toThrow();
  });
  it('replaces only the chosen dog’s managed plan and keeps unrelated appointments', () => {
    const feeding = makeCareEvents(dog(), 'feeding', options);
    const vet: CalendarEvent = {
      id: crypto.randomUUID(),
      title: 'Vet',
      kind: 'Vet',
      start: new Date().toISOString(),
      repeat: 'none',
      timeZone: 'UTC',
      notes: '',
    };
    const original = { ...dog(), events: [...feeding, vet] };
    const next = replaceCarePlan(
      original,
      'feeding',
      makeCareEvents(original, 'feeding', { ...options, times: ['09:00', '19:00'] }),
    );
    expect(next.events).toHaveLength(3);
    expect(next.events).toContainEqual(vet);
    expect(next.events.find((e) => e.carePlan === 'feeding')!.id).toBe(feeding[0].id);
    expect(original.events[0].start).not.toBe(
      next.events.find((e) => e.carePlan === 'feeding')!.start,
    );
  });
});
describe('actual play, charts, badges and same-day training progress', () => {
  it('counts completed time per occurrence, supports undo, and does not count a future plan as activity', () => {
    const events = makeCareEvents(dog(), 'play', { ...options, times: ['16:00'] });
    const original = replaceCarePlan(dog(), 'play', events);
    expect(dogBadges(original).some((b) => b.earned)).toBe(false);
    const completed = togglePlayOccurrence(original, events[0], events[0].start, 25);
    expect(completed.playSessions).toHaveLength(1);
    expect(completed.playSessions![0].minutes).toBe(25);
    expect(
      playChart(completed.playSessions!, 'Month', new Date(2026, 2, 7)).reduce(
        (s, b) => s + b.minutes,
        0,
      ),
    ).toBe(25);
    expect(togglePlayOccurrence(completed, events[0], events[0].start).playSessions).toEqual([]);
    expect(original.playSessions).toBeUndefined();
  });
  it('aggregates week/month/year charts and earns real minute and distinct-day badges', () => {
    const playSessions = Array.from({ length: 30 }, (_, i) => ({
      id: crypto.randomUUID(),
      day: `2026-09-${String(i + 1).padStart(2, '0')}`,
      minutes: 40,
    }));
    const active = { ...dog(), playSessions };
    expect(
      playChart(playSessions, 'Year', new Date(2026, 8, 1)).find((b) => b.key === '2026-09')!
        .minutes,
    ).toBe(1200);
    expect(playChart(playSessions, 'Month', new Date(2026, 8, 1))).toHaveLength(30);
    const badges = dogBadges(active);
    expect(badges.find((b) => b.id === 'play-500')!.earned).toBe(true);
    expect(badges.find((b) => b.id === 'play-1000')!.earned).toBe(true);
    expect(badges.find((b) => b.id === 'days-30')!.earned).toBe(true);
    expect(badges.find((b) => b.id === 'days-60')!.earned).toBe(false);
    expect(dogBadges(dog()).find((b) => b.id === 'play-500')!.earned).toBe(false);
    const state = sampleState();
    state.dogs = [active];
    expect(stateSchema.parse(state).dogs[0].playSessions).toEqual(playSessions);
    expect(parseBackup(JSON.stringify(state))).toEqual(state);
  });
  it('advances six distinct comfortable sessions on one day, including legacy lower milestones, without double-crediting ids', () => {
    let state = sampleState();
    for (let i = 0; i < 6; i++)
      state = recordSession(state, profile.id, practice(21, { milestone: 0 }));
    expect(progressFor(state.dogs[0].sessions, 'calm-at-home').percent).toBe(100);
    expect(state.dogs[0].sessions.map((s) => s.progressSnapshot)).toEqual([
      17, 33, 50, 67, 83, 100,
    ]);
    const same = state.dogs[0].sessions[0];
    const legacy = state.dogs[0].sessions.map((s) => ({ ...s, progressSnapshot: 0 }));
    expect(progressAtSession(legacy, legacy.at(-1)!.id)).toBe(100);
    expect(legacy.at(-1)!.progressSnapshot).toBe(0);
    expect(recordSession(state, profile.id, same).dogs[0].sessions).toHaveLength(6);
  });
});
