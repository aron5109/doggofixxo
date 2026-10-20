import { emptyState, addDog, type Profile, type TrainingSession } from '../lib/model';
export const profile: Profile = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Maple',
  breed: 'Golden mix',
  age: 2,
  weight: 15,
  unit: 'kg',
  sex: 'Female',
  neutered: 'Yes',
  avatar: 0,
  concerns: ['Barking'],
};
export const sampleState = () => addDog(emptyState(), { ...profile });
export function practice(day: number, overrides: Partial<TrainingSession> = {}): TrainingSession {
  const at = `2026-10-${String(day).padStart(2, '0')}T10:00:00.000Z`;
  return {
    id: crypto.randomUUID(),
    lessonId: 'calm-at-home',
    startedAt: at,
    finishedAt: at,
    day: at.slice(0, 10),
    duration: 120,
    outcome: 'great',
    observed: true,
    milestone: 0,
    notes: '',
    progressSnapshot: 0,
    ...overrides,
  };
}
