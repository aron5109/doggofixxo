import { type Dog, type CalendarEvent, type PlaySession, localDay, plusDays } from './model';
import { lessons, lessonCategories } from './lessons';
import { progressFor } from './model';

export type CareKind = 'feeding' | 'bathing' | 'play';
export function ageInYears(dog: Pick<Dog, 'birthday' | 'age'>, now = new Date()) {
  return dog.birthday
    ? Math.max(0, (now.getTime() - new Date(`${dog.birthday}T12:00:00`).getTime()) / 31557600000)
    : dog.age;
}
export function careEstimates(dog: Dog, now = new Date()) {
  const kg = dog.unit === 'lb' ? dog.weight * 0.45359237 : dog.weight;
  const age = ageInYears(dog, now);
  const activity = dog.activityLevel || 'Moderate';
  const multiplier =
    age < 4 / 12
      ? 3
      : age < 1
        ? 2
        : activity === 'High'
          ? 1.8
          : activity === 'Low'
            ? 1.3
            : age >= 8
              ? 1.4
              : 1.6;
  const kcal = 70 * kg ** 0.75 * multiplier;
  const energy = dog.foodKcalPer100g || 350;
  const waterFactor = (age < 1 ? 1.1 : 1) * (activity === 'High' ? 1.25 : 1);
  return {
    suitable: age >= 8 / 52,
    kg,
    kcal: Math.round(kcal),
    grams: Math.round((kcal / energy) * 100),
    energy,
    waterLow: Math.round(kg * 50 * waterFactor),
    waterHigh: Math.round(kg * 60 * waterFactor),
    meals: age < 0.5 ? 3 : 2,
  };
}
export type CarePlanOptions = {
  day: string;
  times: string[];
  repeat: boolean;
  weeks: number;
  minutes: number;
};
export function makeCareEvents(
  dog: Dog,
  kind: CareKind,
  options: CarePlanOptions,
): CalendarEvent[] {
  if (
    !Number.isInteger(options.weeks) ||
    options.weeks < 1 ||
    options.weeks > 52 ||
    !Number.isInteger(options.minutes) ||
    options.minutes < 20 ||
    options.minutes > 60
  ) {
    throw new Error('Choose a play goal from 20 to 60 minutes and a valid bathing interval.');
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(options.day) ||
    !options.times.length ||
    options.times.some((t) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) ||
    new Set(options.times).size !== options.times.length
  )
    throw new Error('Choose valid, distinct times.');
  const startDay = new Date(`${options.day}T00:00:00`);
  if (!Number.isFinite(startDay.getTime()) || localDay(startDay) !== options.day)
    throw new Error('Choose a valid start date.');
  const end = new Date(startDay);
  end.setFullYear(end.getFullYear() + 1);
  end.setMilliseconds(-1);
  const estimate = careEstimates(dog);
  return options.times.map((time, index) => ({
    id: crypto.randomUUID(),
    title:
      kind === 'feeding'
        ? `${dog.name} · meal ${index + 1}`
        : kind === 'bathing'
          ? `${dog.name} · bath check-in`
          : `${dog.name} · attention & play`,
    kind: kind === 'feeding' ? 'Feeding' : kind === 'bathing' ? 'Grooming' : 'Play',
    start: new Date(`${options.day}T${time}:00`).toISOString(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    repeat: options.repeat ? (kind === 'bathing' ? 'weekly' : 'daily') : 'none',
    ...(options.repeat
      ? {
          repeatUntil: end.toISOString(),
          ...(kind === 'bathing' ? { repeatEvery: options.weeks } : {}),
        }
      : {}),
    ...(options.repeat ? { carePlan: kind } : {}),
    ...(kind === 'play' ? { durationMinutes: options.minutes } : {}),
    notes:
      kind === 'feeding'
        ? estimate.suitable
          ? `Approx. ${Math.round(estimate.grams / options.times.length)} g per meal if using food at ${estimate.energy} kcal/100 g; ${estimate.grams} g / ${estimate.kcal} kcal per day. Adjust to the actual food label, body condition and veterinary advice. Keep fresh water freely available.`
          : 'Young puppy: follow a veterinary feeding plan. Keep suitable fresh water available.'
        : kind === 'bathing'
          ? 'Check coat and skin first. Bathe only when needed, using suitable dog products. Coat type and veterinary advice take priority over this reminder.'
          : `${options.minutes} minutes planned. Split into short comfortable sessions, with breaks. Record actual completed minutes, not planned time.`,
  }));
}
export function replaceCarePlan(dog: Dog, kind: CareKind, events: CalendarEvent[]): Dog {
  const previous = dog.events.filter((e) => e.carePlan === kind);
  const next = events.map((e, i) => ({ ...e, id: previous[i]?.id || e.id }));
  return {
    ...dog,
    ...(kind === 'play' ? { playTarget: events[0]?.durationMinutes || dog.playTarget } : {}),
    events: [...dog.events.filter((e) => e.carePlan !== kind), ...next],
  };
}
export function togglePlayOccurrence(
  dog: Dog,
  event: CalendarEvent,
  occurrence: string,
  actualMinutes?: number,
): Dog {
  if (event.kind !== 'Play') return dog;
  const records = dog.playSessions || [];
  const found = records.find((s) => s.eventId === event.id && s.occurrence === occurrence);
  return {
    ...dog,
    playSessions: found
      ? records.filter((s) => s.id !== found.id)
      : [
          ...records,
          {
            id: crypto.randomUUID(),
            day: localDay(occurrence),
            minutes: actualMinutes || event.durationMinutes || dog.playTarget || 20,
            eventId: event.id,
            occurrence,
          },
        ],
  };
}
export type PlayPeriod = 'Week' | 'Month' | 'Year';
export function playChart(records: PlaySession[], period: PlayPeriod, anchor: Date) {
  const first = new Date(anchor.getFullYear(), period === 'Year' ? 0 : anchor.getMonth(), 1);
  if (period === 'Week') {
    first.setTime(anchor.getTime());
    first.setHours(0, 0, 0, 0);
    first.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  }
  const count =
    period === 'Week'
      ? 7
      : period === 'Year'
        ? 12
        : new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return Array.from({ length: count }, (_, index) => {
    const date =
      period === 'Year' ? new Date(first.getFullYear(), index, 1) : plusDays(first, index);
    const key = period === 'Year' ? localDay(date).slice(0, 7) : localDay(date);
    const minutes = records
      .filter((s) => (period === 'Year' ? s.day.startsWith(key) : s.day === key))
      .reduce((sum, s) => sum + s.minutes, 0);
    return {
      key,
      minutes,
      label: date.toLocaleDateString(
        'en',
        period === 'Year'
          ? { month: 'short', year: 'numeric' }
          : { month: 'short', day: 'numeric' },
      ),
    };
  });
}
export function dogBadges(dog: Dog) {
  const records = dog.playSessions || [];
  const minutes = records.reduce((sum, record) => sum + record.minutes, 0);
  const days = new Set(records.map((r) => r.day)).size;
  return [
    ...lessonCategories.map((category) => {
      const collection = lessons.filter((l) => l.category === category);
      const complete = collection.filter((l) => progressFor(dog.sessions, l.id).complete).length;
      return {
        id: `training-${category}`,
        title: `${category} collection`,
        description: `${complete}/${collection.length} lesson milestones completed`,
        earned: complete === collection.length,
        percent: Math.round((complete / collection.length) * 100),
        emoji: '🎓',
      };
    }),
    ...[500, 1000, 2500, 5000].map((target) => ({
      id: `play-${target}`,
      title: `${target.toLocaleString()} play minutes`,
      description: `${minutes.toLocaleString()}/${target.toLocaleString()} completed minutes`,
      earned: minutes >= target,
      percent: Math.min(100, Math.round((minutes / target) * 100)),
      emoji: '🎾',
    })),
    ...[30, 60, 90, 180].map((target) => ({
      id: `days-${target}`,
      title: `${target / 30} ${target === 30 ? 'month' : 'months'} of active days`,
      description: `${days}/${target} distinct days with recorded play; days need not be consecutive`,
      earned: days >= target,
      percent: Math.min(100, Math.round((days / target) * 100)),
      emoji: '🏅',
    })),
  ];
}
