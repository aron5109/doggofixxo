import { z } from 'zod';

export const categories = [
  'Barking',
  'Separation worries',
  'Chewing',
  'Walking',
  'Bathing',
] as const;
export type Category = (typeof categories)[number];
const timestamp = z.string().datetime({ offset: true });
const id = z.string().uuid();
export const profileSchema = z.object({
  id,
  name: z.string().trim().min(1).max(40),
  breed: z.string().trim().min(1).max(80),
  age: z.number().min(0).max(30),
  weight: z.number().positive().max(300),
  unit: z.enum(['kg', 'lb']),
  sex: z.enum(['Female', 'Male', 'Unknown']),
  neutered: z.enum(['Yes', 'No', 'Unknown']),
  avatar: z.number().int().min(0).max(7),
  photo: z
    .string()
    .max(350000)
    .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/)
    .optional(),
  concerns: z.array(z.enum(categories)).min(1).max(5),
  birthday: z.iso.date().optional(),
  microchip: z
    .string()
    .trim()
    .max(30)
    .regex(/^[A-Za-z0-9 -]*$/)
    .optional(),
  activityLevel: z.enum(['Low', 'Moderate', 'High']).optional(),
  foodKcalPer100g: z.number().min(20).max(1000).optional(),
  playTarget: z.number().int().min(20).max(60).optional(),
});
export const sessionSchema = z.object({
  id,
  lessonId: z.string().min(1).max(80),
  startedAt: timestamp,
  finishedAt: timestamp,
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  duration: z.number().int().min(0).max(86400),
  outcome: z.enum(['great', 'progress', 'difficult']),
  observed: z.boolean(),
  milestone: z.number().int().min(0).max(3),
  notes: z.string().max(1000),
  progressSnapshot: z.number().min(0).max(100),
});
export const eventSchema = z.object({
  id,
  title: z.string().trim().min(1).max(100),
  kind: z.enum(['Training', 'Vet', 'Grooming', 'Birthday', 'Reminder', 'Feeding', 'Play']),
  start: timestamp,
  timeZone: z.string().min(1).max(100),
  repeat: z.enum(['none', 'daily', 'weekly', 'monthly', 'yearly']),
  repeatEvery: z.number().int().min(1).max(52).optional(),
  repeatUntil: timestamp.optional(),
  carePlan: z.enum(['feeding', 'bathing', 'play', 'birthday']).optional(),
  durationMinutes: z.number().int().min(1).max(240).optional(),
  lessonId: z.string().max(80).optional(),
  notes: z.string().max(1000),
});
export const playSessionSchema = z.object({
  id,
  day: z.iso.date(),
  minutes: z.number().int().min(1).max(240),
  eventId: id.optional(),
  occurrence: timestamp.optional(),
});
export type PlaySession = z.infer<typeof playSessionSchema>;
export const dogSchema = profileSchema.extend({
  sessions: z.array(sessionSchema).max(1000),
  events: z.array(eventSchema).max(300),
  playSessions: z.array(playSessionSchema).max(10000).optional(),
});
export const stateSchema = z
  .object({
    version: z.literal(1),
    dogs: z.array(dogSchema).max(12),
    activeDogId: id.nullable(),
    favorites: z.array(z.string().max(80)).max(500),
  })
  .superRefine((value, ctx) => {
    if (new Set(value.dogs.map((d) => d.id)).size !== value.dogs.length)
      ctx.addIssue({ code: 'custom', message: 'Duplicate dog profiles.' });
    if (value.activeDogId && !value.dogs.some((d) => d.id === value.activeDogId))
      ctx.addIssue({ code: 'custom', message: 'Selected dog is missing.' });
    for (const dog of value.dogs) {
      if (
        new Set(dog.sessions.map((s) => s.id)).size !== dog.sessions.length ||
        new Set(dog.events.map((e) => e.id)).size !== dog.events.length ||
        new Set((dog.playSessions || []).map((s) => s.id)).size !== (dog.playSessions || []).length
      )
        ctx.addIssue({ code: 'custom', message: 'Duplicate records.' });
    }
  });
export type Profile = z.infer<typeof profileSchema>;
export type Dog = z.infer<typeof dogSchema>;
export type TrainingSession = z.infer<typeof sessionSchema>;
export type CalendarEvent = z.infer<typeof eventSchema>;
export type AppState = z.infer<typeof stateSchema>;
export const emptyState = (): AppState => ({
  version: 1,
  dogs: [],
  activeDogId: null,
  favorites: [],
});
export function parseBackup(text: string): AppState {
  if (text.length > 8_000_000) throw new Error('Please use a backup smaller than 8 MB.');
  return stateSchema.parse(JSON.parse(text));
}
export function addDog(state: AppState, profile: Profile): AppState {
  if (state.dogs.length >= 12) throw new Error('You can have up to 12 dog profiles.');
  return {
    ...state,
    activeDogId: profile.id,
    dogs: [...state.dogs, syncBirthday({ ...profile, sessions: [], events: [] })],
  };
}
export function updateDog(state: AppState, dogId: string, update: (dog: Dog) => Dog): AppState {
  return {
    ...state,
    dogs: state.dogs.map((dog) => (dog.id === dogId ? syncBirthday(update(dog), dog) : dog)),
  };
}
function syncBirthday(dog: Dog, previous?: Dog): Dog {
  const existing = dog.events.find((event) => event.carePlan === 'birthday');
  const events = dog.events.filter((event) => event.carePlan !== 'birthday');
  if (!dog.birthday) return existing ? { ...dog, events } : dog;
  const start =
    existing && previous?.birthday === dog.birthday
      ? new Date(existing.start)
      : new Date(`${dog.birthday}T09:00:00`);
  if (!Number.isFinite(start.getTime())) return dog;
  const birthday: CalendarEvent = {
    id: existing?.id || crypto.randomUUID(),
    title: `${dog.name}’s birthday`,
    kind: 'Birthday',
    start: start.toISOString(),
    repeat: 'yearly',
    carePlan: 'birthday',
    timeZone: existing?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    notes:
      'Added automatically from the birthday in this dog’s profile. Edit the profile to change it.',
  };
  return { ...dog, events: [...events, birthday] };
}
export function localDay(value: Date | string): string {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function plusDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}
export function localInput(date: Date): string {
  return `${localDay(date)}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
export function progressFor(sessions: TrainingSession[], lessonId: string) {
  let milestone = 0;
  let successes = 0;
  const ids = new Set<string>();
  for (const session of [...sessions]
    .filter((s) => s.lessonId === lessonId)
    .sort((a, b) => a.finishedAt.localeCompare(b.finishedAt))) {
    if (ids.has(session.id)) continue;
    ids.add(session.id);
    if (
      milestone >= 3 ||
      session.milestone > milestone ||
      session.outcome !== 'great' ||
      !session.observed
    )
      continue;
    successes++;
    if (successes % 2 === 0) milestone++;
  }
  return {
    percent: Math.round((successes / 6) * 100),
    milestone,
    successes,
    complete: milestone === 3,
  };
}
export function progressAtSession(sessions: TrainingSession[], id: string): number {
  const ordered = [...sessions].sort((a, b) => a.finishedAt.localeCompare(b.finishedAt));
  const index = ordered.findIndex((session) => session.id === id);
  return index < 0 ? 0 : progressFor(ordered.slice(0, index + 1), ordered[index].lessonId).percent;
}
export function recordSession(state: AppState, dogId: string, session: TrainingSession): AppState {
  return updateDog(state, dogId, (dog) => {
    if (dog.sessions.some((s) => s.id === session.id)) return dog;
    const sessions = [...dog.sessions, session];
    const progressSnapshot = progressFor(sessions, session.lessonId).percent;
    return { ...dog, sessions: [...dog.sessions, { ...session, progressSnapshot }] };
  });
}
export function nextPractice(
  outcome: TrainingSession['outcome'],
  complete: boolean,
  now = new Date(),
): Date {
  return plusDays(now, outcome === 'difficult' ? 2 : complete ? 7 : 1);
}
export function remainingSeconds(
  deadline: number | null,
  pausedSeconds: number,
  now = Date.now(),
): number {
  return deadline === null ? pausedSeconds : Math.max(0, Math.ceil((deadline - now) / 1000));
}
export type Occurrence = CalendarEvent & { occurrence: string };
export function occurrences(events: CalendarEvent[], from: Date, until: Date): Occurrence[] {
  const results: Occurrence[] = [];
  for (const event of events) {
    const start = new Date(event.start);
    let date = new Date(start);
    let index = 0;
    const every = event.repeatEvery || 1;
    const end =
      event.repeat !== 'none' && event.repeatUntil
        ? new Date(Math.min(until.getTime(), new Date(event.repeatUntil).getTime()))
        : until;
    // Skip old daily/weekly occurrences while preserving their local wall-clock time.
    if (event.repeat === 'daily' || event.repeat === 'weekly') {
      const days = (event.repeat === 'weekly' ? 7 : 1) * every;
      index = Math.max(0, Math.floor((from.getTime() - start.getTime()) / (86400000 * days)) - 2);
      date.setDate(start.getDate() + index * days);
    }
    while (date <= end && index < 100000) {
      if (date >= from) results.push({ ...event, occurrence: date.toISOString() });
      if (event.repeat === 'none') break;
      index++;
      date = new Date(start);
      if (event.repeat === 'daily') date.setDate(start.getDate() + index * every);
      else if (event.repeat === 'weekly') date.setDate(start.getDate() + index * 7 * every);
      else {
        const month =
          start.getMonth() + (event.repeat === 'monthly' ? index * every : index * 12 * every);
        date.setDate(1);
        date.setMonth(month);
        const last = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        date.setDate(Math.min(start.getDate(), last));
      }
    }
  }
  return results.sort((a, b) => a.occurrence.localeCompare(b.occurrence));
}
