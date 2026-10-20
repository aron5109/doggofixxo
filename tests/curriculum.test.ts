import { describe, expect, it } from 'vitest';
import { lessons, lessonById, lessonCategories, lessonLevels } from '../lib/lessons';
import { tips } from '../lib/tips';
import { references } from '../lib/references';
import { parseBackup, recordSession, stateSchema } from '../lib/model';
import { practice, profile, sampleState } from './fixtures';

const originalLessonIds = [
  'calm-at-home',
  'doorbell-detective',
  'strangers-are-okay',
  'tiny-goodbyes',
  'everyday-departures',
  'my-cozy-spot',
  'chew-this-instead',
  'trade-it',
  'puppy-proof-paradise',
  'loose-leash-magic',
  'walk-with-me',
  'sniff-and-stroll',
  'happy-bathroom',
  'splash-confidence',
  'fresh-and-fluffy',
];

describe('expanded training compatibility and prerequisite graph', () => {
  it('retains every existing lesson ID as a foundation and adds usable later levels', () => {
    expect(
      lessons.filter((lesson) => lesson.level === 'Foundation').map((lesson) => lesson.id),
    ).toEqual(originalLessonIds);
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length);
    expect(lessons.filter((lesson) => lesson.level === 'Intermediate')).toHaveLength(10);
    expect(lessons.filter((lesson) => lesson.level === 'Advanced')).toHaveLength(10);
    for (const lesson of lessons) {
      expect(lesson.id.length).toBeLessThanOrEqual(80);
      expect(lessonCategories).toContain(lesson.category);
      expect(lesson.readiness).toBeTruthy();
      if (lesson.level !== 'Foundation') expect(lesson.sources).toContain('avsab');
    }
  });

  it('resolves every prerequisite without cycles or dependence on a harder level', () => {
    const visit = (id: string, path: Set<string>) => {
      expect(path.has(id), `Prerequisite cycle at ${[...path, id].join(' -> ')}`).toBe(false);
      const lesson = lessonById(id);
      expect(lesson, `Missing prerequisite ${id}`).toBeDefined();
      const nextPath = new Set([...path, id]);
      for (const prerequisiteId of lesson!.prerequisites) {
        const prerequisite = lessonById(prerequisiteId);
        expect(prerequisite, `Missing prerequisite for ${id}`).toBeDefined();
        expect(lessonLevels.indexOf(prerequisite!.level)).toBeLessThanOrEqual(
          lessonLevels.indexOf(lesson!.level),
        );
        visit(prerequisiteId, nextPath);
      }
    };
    for (const lesson of lessons) {
      if (lesson.level !== 'Foundation') expect(lesson.prerequisites.length).toBeGreaterThan(0);
      visit(lesson.id, new Set());
    }
  });

  it('round-trips later-level practice and appointments without changing backup version', () => {
    const advanced = lessons.find((lesson) => lesson.level === 'Advanced')!;
    const state = recordSession(
      sampleState(),
      profile.id,
      practice(20, {
        lessonId: advanced.id,
        notes: 'Comfortable in the easy setup.',
      }),
    );
    state.dogs[0].events.push({
      id: crypto.randomUUID(),
      title: advanced.title,
      kind: 'Training',
      start: '2026-10-21T10:00:00.000Z',
      timeZone: 'Atlantic/Reykjavik',
      repeat: 'none',
      lessonId: advanced.id,
      notes: '',
    });
    const restored = parseBackup(JSON.stringify(state));
    expect(restored).toEqual(state);
    expect(restored.version).toBe(1);
    expect(restored.dogs[0].sessions[0].progressSnapshot).toBe(17);
    expect(lessonById(restored.dogs[0].events[0].lessonId!)).toBe(advanced);
  });
});

describe('expanded tip favorites and reading references', () => {
  it('keeps existing saved-tip IDs attached to their original advice', () => {
    const existing = [
      ['calming-routines-0', 'A predictable routine can help your dog feel more secure.'],
      ['walking-0', 'Sniffing is not wasted time. It is part of how dogs explore their world.'],
      ['grooming-6', 'Bathing needs vary. Follow advice for your dog’s coat and medical needs.'],
      [
        'understanding-body-language-6',
        'Loose muscles, easy movement and voluntary engagement are useful signs of comfort.',
      ],
    ];
    for (const [id, text] of existing) expect(tips.find((tip) => tip.id === id)?.text).toBe(text);
    expect(new Set(tips.map((tip) => tip.id)).size).toBe(tips.length);
  });

  it('can save every tip in the larger catalog through the production validation schema', () => {
    const state = sampleState();
    state.favorites = tips.map((tip) => tip.id);
    expect(state.favorites.length).toBeGreaterThan(100);
    expect(stateSchema.parse(state).favorites).toEqual(state.favorites);
    expect(parseBackup(JSON.stringify(state)).favorites).toEqual(state.favorites);
    expect(() => stateSchema.parse({ ...state, favorites: Array(501).fill('tip') })).toThrow();
  });

  it('offers all five trainers as further reading with valid catalog references', () => {
    for (const id of ['zak', 'stilwell', 'mcmillan', 'bat', 'cesar'] as const) {
      expect(references[id].title).toContain('further reading');
      expect(new URL(references[id].url).protocol).toBe('https:');
      expect(lessons.some((lesson) => lesson.sources.includes(id))).toBe(true);
      expect(tips.some((tip) => tip.source === id)).toBe(true);
    }
    for (const tip of tips) expect(references[tip.source]).toBeDefined();
  });
});
