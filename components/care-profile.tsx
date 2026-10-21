'use client';
import { useState } from 'react';
import {
  CalendarPlus,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Utensils,
  Trophy,
  Plus,
} from 'lucide-react';
import { type Dog, type CalendarEvent, localDay } from '@/lib/model';
import {
  careEstimates,
  makeCareEvents,
  replaceCarePlan,
  dogBadges,
  playChart,
  type CareKind,
  type PlayPeriod,
} from '@/lib/care';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';

const labels: Record<CareKind, string> = {
  feeding: 'feeding',
  bathing: 'bathing',
  play: 'attention & play',
};
function CarePlanner({
  dog,
  kind,
  minutes,
  onApply,
  onManual,
  onClose,
}: {
  dog: Dog;
  kind: CareKind;
  minutes: number;
  onApply: (dog: Dog) => boolean;
  onManual: (event: CalendarEvent) => void;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<'times' | 'choice' | 'review'>('times');
  const [day, setDay] = useState(localDay(new Date()));
  const [times, setTimes] = useState(
    kind === 'feeding'
      ? careEstimates(dog).meals === 3
        ? ['08:00', '13:00', '18:00']
        : ['08:00', '18:00']
      : ['17:00'],
  );
  const [weeks, setWeeks] = useState(6);
  const [error, setError] = useState('');
  const end = new Date(`${day}T00:00:00`);
  end.setFullYear(end.getFullYear() + 1);
  end.setDate(end.getDate() - 1);
  function events(repeat: boolean) {
    return makeCareEvents(dog, kind, { day, times, weeks, minutes, repeat });
  }
  return (
    <Modal open title={`Plan ${labels[kind]}`} onClose={onClose}>
      {stage === 'times' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              events(true);
              setError('');
              setStage('choice');
            } catch (cause) {
              setError(String((cause as Error).message));
            }
          }}
        >
          <h3>Which times work best for you?</h3>
          <p>Choose a comfortable routine for {dog.name}. Nothing is added until you approve it.</p>
          <label>
            Start date
            <input
              type="date"
              required
              min={localDay(new Date())}
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </label>
          {kind === 'feeding' && (
            <label>
              Meals per day
              <select
                value={times.length}
                onChange={(e) => {
                  const count = Number(e.target.value);
                  setTimes(
                    count === 1
                      ? ['08:00']
                      : count === 2
                        ? ['08:00', '18:00']
                        : count === 3
                          ? ['08:00', '13:00', '18:00']
                          : ['08:00', '12:00', '16:00', '20:00'],
                  );
                }}
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          )}
          <div className="field-grid">
            {times.map((time, i) => (
              <label key={i}>
                {kind === 'feeding' ? `Meal ${i + 1} time` : 'Preferred time'}
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTimes(times.map((t, j) => (j === i ? e.target.value : t)))}
                />
              </label>
            ))}
          </div>
          {kind === 'bathing' && (
            <label>
              Check in every
              <select value={weeks} onChange={(e) => setWeeks(Number(e.target.value))}>
                {[2, 4, 6, 8, 12].map((n) => (
                  <option key={n} value={n}>
                    {n} weeks
                  </option>
                ))}
              </select>
            </label>
          )}
          {kind === 'bathing' && (
            <p className="small muted">
              Six weeks is an editable reminder to assess the coat, not a requirement to bathe. Some
              dogs need much less frequent bathing; follow coat and veterinary advice.
            </p>
          )}
          {kind === 'play' && (
            <p>{minutes} minutes per day, split into comfortable sessions with breaks.</p>
          )}
          {error && <p role="alert">{error}</p>}
          <Button type="submit">Continue to calendar options</Button>
        </form>
      )}
      {stage === 'choice' && (
        <div>
          <h3>Would you like this to repeat for one year?</h3>
          <p>
            {times.join(' and ')}
            {kind === 'bathing' ? `, every ${weeks} weeks` : ', every day'}, from {day} through{' '}
            {localDay(end)}.
          </p>
          <p>You can approve the year plan or add individual appointments yourself.</p>
          <div className="actions">
            <Button onClick={() => setStage('review')}>Review one-year plan</Button>
            <Button
              variant="secondary"
              onClick={() => {
                const event = events(false)[0];
                onClose();
                onManual(event);
              }}
            >
              Add manually instead
            </Button>
          </div>
          <p className="small muted">
            Manual opens one appointment for you to edit and save. For meals, add any other meal
            times in Calendar.
          </p>
          <Button variant="ghost" onClick={() => setStage('times')}>
            Change times
          </Button>
        </div>
      )}
      {stage === 'review' && (
        <div>
          <h3>
            Confirm {dog.name}’s {labels[kind]} plan
          </h3>
          <p>
            <strong>{times.join(' and ')}</strong> ·{' '}
            {kind === 'bathing' ? `every ${weeks} weeks` : 'every day'}
          </p>
          <p>
            {day} through {localDay(end)} · {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </p>
          <p>
            {kind === 'play'
              ? `${minutes} minutes planned daily. Only completed minutes count in the graph and badges.`
              : kind === 'feeding'
                ? 'Meal notes include your current approximate feeding guide. Update the plan after changing food or weight.'
                : 'Each reminder is a coat check-in; skip bathing if it is not needed.'}
          </p>
          {dog.events.some((event) => event.carePlan === kind) && (
            <p>
              This replaces {dog.name}’s previous {labels[kind]} plan. Other appointments and
              completed activity stay saved.
            </p>
          )}
          <div className="actions">
            <Button
              onClick={() => {
                if (onApply(replaceCarePlan(dog, kind, events(true)))) onClose();
                else
                  setError(
                    'The plan could not be saved. Check your connection or calendar record limit.',
                  );
              }}
            >
              Confirm one-year {kind} plan
            </Button>
            <Button variant="secondary" onClick={() => setStage('choice')}>
              Back
            </Button>
          </div>
          {error && <p role="alert">{error}</p>}
        </div>
      )}
    </Modal>
  );
}

export function CareProfile({
  dog,
  onUpdate,
  onManual,
}: {
  dog: Dog;
  onUpdate: (dog: Dog) => boolean;
  onManual: (event: CalendarEvent) => void;
}) {
  const estimate = careEstimates(dog);
  const [planner, setPlanner] = useState<CareKind | null>(null);
  const [activity, setActivity] = useState(dog.activityLevel || 'Moderate');
  const [energy, setEnergy] = useState(dog.foodKcalPer100g || 350);
  const [target, setTarget] = useState(dog.playTarget || 20);
  const [actual, setActual] = useState(dog.playTarget || 20);
  const [logDay, setLogDay] = useState(localDay(new Date()));
  const [message, setMessage] = useState('');
  const [period, setPeriod] = useState<PlayPeriod>('Week');
  const [anchor, setAnchor] = useState(new Date());
  const records = dog.playSessions || [];
  const chart = playChart(records, period, anchor);
  const max = Math.max(1, ...chart.map((bar) => bar.minutes));
  const total = chart.reduce((sum, bar) => sum + bar.minutes, 0);
  const badges = dogBadges(dog);
  const earned = badges.filter((badge) => badge.earned);
  function move(direction: number) {
    const next = new Date(anchor);
    if (period === 'Week') next.setDate(next.getDate() + direction * 7);
    else {
      next.setDate(1);
      if (period === 'Month') next.setMonth(next.getMonth() + direction);
      else next.setFullYear(next.getFullYear() + direction);
    }
    setAnchor(next);
  }
  return (
    <div className="care-sections">
      <section className="card care-card">
        <span className="eyebrow">EVERYDAY CARE</span>
        <h2>
          <Utensils size={21} /> Food & water · approx.
        </h2>
        <p>
          A rough planning guide, not a scientific assessment of your dog or a feeding prescription.
          Check body condition, the food label and your vet’s advice, especially during growth or
          illness.
        </p>
        <div className="care-estimates">
          <div>
            <span>Approx. food per day</span>
            <strong>{estimate.suitable ? `${estimate.grams} g` : 'Ask your vet'}</strong>
            <small>
              {estimate.suitable
                ? `about ${estimate.kcal} kcal/day`
                : 'Young puppies need an individual plan'}
            </small>
          </div>
          <div>
            <span>
              <Droplets size={14} /> Approx. total water per day
            </span>
            <strong>
              {estimate.suitable ? `${estimate.waterLow}–${estimate.waterHigh} ml` : 'Ask your vet'}
            </strong>
            <small>
              Includes water in food. Fresh drinking water stays freely available; heat and activity
              increase needs.
            </small>
          </div>
        </div>
        <p className="small muted">
          Food weight assumes {estimate.energy} kcal per 100 g. Different foods, especially wet
          food, have very different energy densities. Treats count toward the daily allowance.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onUpdate({ ...dog, activityLevel: activity, foodKcalPer100g: energy }))
              setMessage('Care estimate settings saved.');
          }}
        >
          <div className="field-grid">
            <label>
              Daily movement
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value as typeof activity)}
              >
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </label>
            <label>
              Food energy · kcal per 100 g
              <input
                type="number"
                required
                min={20}
                max={1000}
                step="1"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
              />
            </label>
          </div>
          <Button type="submit" variant="secondary">
            Save care estimates
          </Button>
        </form>
        <Button onClick={() => setPlanner('feeding')}>
          <CalendarPlus size={17} /> Plan feeding times
        </Button>
      </section>
      <section className="card care-card">
        <h2>Bathing check-ins</h2>
        <p>
          Start with an optional coat check-in every six weeks and adjust for {dog.name}’s coat,
          skin and routine. A calendar reminder does not mean a bath is due.
        </p>
        <Button variant="secondary" onClick={() => setPlanner('bathing')}>
          <CalendarPlus size={17} /> Plan bathing check-ins
        </Button>
      </section>
      <section className="card care-card">
        <h2>Active Attention & Play</h2>
        <p>
          Choose 20–60 minutes of daily attention and play. Split it into age-appropriate sessions;
          this is a personal goal, not a prescribed exercise dose.
        </p>
        <label>
          Daily play goal · {target} minutes
          <input
            type="range"
            min={20}
            max={60}
            step={5}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </label>
        <div className="actions">
          <Button
            variant="secondary"
            onClick={() => {
              if (onUpdate({ ...dog, playTarget: target })) setMessage('Daily play goal saved.');
            }}
          >
            Save play goal
          </Button>
          <Button onClick={() => setPlanner('play')}>
            <CalendarPlus size={17} /> Plan daily play
          </Button>
        </div>
        <form
          className="play-log-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (
              onUpdate({
                ...dog,
                playSessions: [
                  ...records,
                  { id: crypto.randomUUID(), day: logDay, minutes: actual },
                ],
              })
            )
              setMessage(`${actual} completed play minutes recorded.`);
          }}
        >
          <h3>Record completed play</h3>
          <div className="field-grid">
            <label>
              Play date
              <input
                type="date"
                required
                max={localDay(new Date())}
                value={logDay}
                onChange={(e) => setLogDay(e.target.value)}
              />
            </label>
            <label>
              Actual minutes
              <input
                type="number"
                required
                min={1}
                max={240}
                value={actual}
                onChange={(e) => setActual(Number(e.target.value))}
              />
            </label>
          </div>
          <Button type="submit" variant="secondary">
            <Plus size={16} /> Log completed play
          </Button>
          <p className="small muted">
            For scheduled play, use Mark play done in Calendar. Do not log the same session twice.
          </p>
        </form>
        <div className="section-heading play-chart-heading">
          <h3>Completed playing time</h3>
          <div className="segmented" role="group" aria-label="Activity chart period">
            {(['Week', 'Month', 'Year'] as const).map((item) => (
              <button
                key={item}
                aria-pressed={period === item}
                className={period === item ? 'active' : ''}
                onClick={() => setPeriod(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="row between">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous activity period"
            onClick={() => move(-1)}
          >
            <ChevronLeft />
          </Button>
          <strong>
            {period === 'Year'
              ? anchor.getFullYear()
              : period === 'Month'
                ? anchor.toLocaleDateString('en', { month: 'long', year: 'numeric' })
                : `${chart[0].label} – ${chart.at(-1)!.label}, ${anchor.getFullYear()}`}
          </strong>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next activity period"
            onClick={() => move(1)}
          >
            <ChevronRight />
          </Button>
        </div>
        <p>
          <strong>{total.toLocaleString()} minutes</strong> completed in this {period.toLowerCase()}
          .
        </p>
        <div
          className="play-chart"
          role="img"
          aria-label={`${period} play chart: ${total} completed minutes. Full values are in the activity data table.`}
        >
          {chart.map((bar, i) => (
            <div
              className="play-chart-column"
              key={bar.key}
              title={`${bar.label}: ${bar.minutes} minutes`}
            >
              <div className="play-chart-track">
                <span style={{ height: `${(bar.minutes / max) * 100}%` }} />
              </div>
              <small>
                {period === 'Week' || period === 'Year' || i % 7 === 0
                  ? period === 'Year'
                    ? bar.label.slice(0, 3)
                    : Number(bar.key.slice(-2))
                  : '·'}
              </small>
            </div>
          ))}
        </div>
        <details>
          <summary>View activity data</summary>
          <table className="activity-table">
            <caption>Completed minutes by {period === 'Year' ? 'month' : 'day'}</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Minutes</th>
              </tr>
            </thead>
            <tbody>
              {chart.map((bar) => (
                <tr key={bar.key}>
                  <th scope="row">{bar.label}</th>
                  <td>{bar.minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
        {records.length > 0 && (
          <details>
            <summary>Recent play logs · {records.length} saved</summary>
            <ul className="play-log-list">
              {[...records]
                .sort((a, b) => b.day.localeCompare(a.day))
                .slice(0, 12)
                .map((record) => (
                  <li key={record.id}>
                    <span>
                      {record.day} · {record.minutes} min
                    </span>
                    <Button
                      variant="ghost"
                      size="small"
                      aria-label={`Remove play log ${record.day} ${record.minutes} minutes`}
                      onClick={() =>
                        onUpdate({
                          ...dog,
                          playSessions: records.filter((s) => s.id !== record.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </li>
                ))}
            </ul>
          </details>
        )}
      </section>
      <section className="card care-card">
        <h2>
          <Trophy size={21} /> {dog.name}’s badges
        </h2>
        <p>
          {earned.length
            ? `${earned.length} milestones earned. Keep enjoying the journey together.`
            : 'Complete lesson collections and record real play to earn your first badge.'}
        </p>
        <div className="earned-badges">
          {earned.map((badge) => (
            <span className="earned-badge" key={badge.id}>
              {badge.emoji} {badge.title} <Check size={14} />
            </span>
          ))}
        </div>
        <details>
          <summary>
            All milestones · {earned.length}/{badges.length} earned
          </summary>
          <div className="badge-grid">
            {badges.map((badge) => (
              <article className={`milestone-badge ${badge.earned ? 'earned' : ''}`} key={badge.id}>
                <span aria-hidden="true">{badge.emoji}</span>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
                <progress max={100} value={badge.percent} aria-label={`${badge.title} progress`} />
                <small>{badge.earned ? 'Earned' : `${badge.percent}%`}</small>
              </article>
            ))}
          </div>
        </details>
        <p className="small muted">
          Training badges reflect recorded practice milestones, not a certification. Active-day
          badges count distinct completed-play dates, not necessarily consecutive days.
        </p>
      </section>
      {message && (
        <p role="status" className="care-message">
          {message}
        </p>
      )}
      {planner && (
        <CarePlanner
          dog={dog}
          kind={planner}
          minutes={target}
          onApply={onUpdate}
          onManual={onManual}
          onClose={() => setPlanner(null)}
        />
      )}
    </div>
  );
}
