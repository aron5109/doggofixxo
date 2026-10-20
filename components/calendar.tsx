'use client';
import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock3,
  Repeat2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  type Dog,
  type CalendarEvent,
  type TrainingSession,
  localDay,
  localInput,
  occurrences,
  plusDays,
  eventSchema,
  progressFor,
} from '@/lib/model';
import { lessons, lessonById } from '@/lib/lessons';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
export type EventDraft = {
  event?: CalendarEvent;
  date?: Date;
  lessonId?: string;
  maintenance?: boolean;
};
export function EventEditor({
  draft,
  onSave,
  onDelete,
  onClose,
}: {
  draft: EventDraft;
  onSave: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState<CalendarEvent>(
    () =>
      draft.event || {
        id: crypto.randomUUID(),
        title: draft.lessonId ? lessonById(draft.lessonId)?.title || 'Training' : '',
        kind: draft.lessonId ? 'Training' : 'Reminder',
        start: (draft.date || new Date()).toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        repeat: draft.maintenance ? 'weekly' : 'none',
        lessonId: draft.lessonId,
        notes: '',
      },
  );
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const patch = (update: Partial<CalendarEvent>) => setValue({ ...value, ...update });
  return (
    <Modal
      open
      title={draft.event ? 'Edit appointment' : 'A little plan for your pup'}
      description={`Times are shown in ${Intl.DateTimeFormat().resolvedOptions().timeZone}. Recurring reminders repeat in this browser’s local time.`}
      onClose={onClose}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const result = eventSchema.safeParse(value);
          if (result.success) onSave(result.data);
          else setError('Check the title, date and time.');
        }}
      >
        <label>
          Title
          <input
            value={value.title}
            maxLength={100}
            required
            placeholder="What’s on the calendar?"
            onChange={(e) => patch({ title: e.target.value })}
          />
        </label>
        <div className="field-grid">
          <label>
            Type
            <select
              value={value.kind}
              onChange={(e) =>
                patch({ kind: e.target.value as CalendarEvent['kind'], lessonId: undefined })
              }
            >
              {['Training', 'Vet', 'Grooming', 'Birthday', 'Reminder'].map((kind) => (
                <option key={kind}>{kind}</option>
              ))}
            </select>
          </label>
          <label>
            Date and time
            <input
              type="datetime-local"
              required
              value={localInput(new Date(value.start))}
              onChange={(e) => {
                const date = new Date(e.target.value);
                if (!isNaN(date.getTime()))
                  patch({
                    start: date.toISOString(),
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                  });
              }}
            />
          </label>
        </div>
        {value.kind === 'Training' && (
          <label>
            Lesson (optional)
            <select
              value={value.lessonId || ''}
              onChange={(e) =>
                patch({
                  lessonId: e.target.value || undefined,
                  ...(e.target.value ? { title: lessonById(e.target.value)!.title } : {}),
                })
              }
            >
              <option value="">General practice</option>
              {lessons.map((lesson) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Repeat
          <select
            value={value.repeat}
            onChange={(e) => patch({ repeat: e.target.value as CalendarEvent['repeat'] })}
          >
            <option value="none">Does not repeat</option>
            <option value="weekly">Every week</option>
            <option value="monthly">Every month</option>
            <option value="yearly">Every year</option>
          </select>
        </label>
        <label>
          Notes (optional)
          <textarea
            rows={3}
            maxLength={1000}
            value={value.notes}
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </label>
        {draft.event && value.repeat !== 'none' && (
          <p className="small muted">Editing or deleting changes the entire recurring series.</p>
        )}
        {error && (
          <p role="alert" className="error-text">
            {error}
          </p>
        )}
        <div className="actions">
          <Button type="submit">Save appointment</Button>
          {draft.event && (
            <Button type="button" variant="danger" onClick={() => setDeleting(true)}>
              <Trash2 size={17} /> Delete
            </Button>
          )}
        </div>
        {deleting && (
          <div className="delete-confirm" role="alert">
            <p>Delete this appointment{value.repeat !== 'none' ? ' and every repeat' : ''}?</p>
            <Button type="button" variant="danger" onClick={() => onDelete(value.id)}>
              Yes, delete
            </Button>
            <Button type="button" variant="ghost" onClick={() => setDeleting(false)}>
              Keep it
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
}
export function Calendar({
  dog,
  onEdit,
  onSession,
}: {
  dog: Dog;
  onEdit: (draft: EventDraft) => void;
  onSession: (session: TrainingSession) => void;
}) {
  const [view, setView] = useState<'Month' | 'Week' | 'Agenda'>('Month');
  const [date, setDate] = useState(() => new Date());
  const [selected, setSelected] = useState(() => localDay(new Date()));
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const weekStart = plusDays(date, -((date.getDay() + 6) % 7));
  weekStart.setHours(0, 0, 0, 0);
  const from =
    view === 'Month'
      ? plusDays(monthStart, -((monthStart.getDay() + 6) % 7))
      : view === 'Week'
        ? weekStart
        : new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const until = plusDays(from, view === 'Month' ? 42 : view === 'Week' ? 7 : 30);
  until.setMilliseconds(-1);
  const planned = occurrences(dog.events, from, until);
  const completed = dog.sessions.filter(
    (s) => new Date(s.finishedAt) >= from && new Date(s.finishedAt) <= until,
  );
  const days = Array.from({ length: view === 'Month' ? 42 : 7 }, (_, i) => plusDays(from, i));
  const shownPlanned =
    view === 'Agenda' ? planned : planned.filter((e) => localDay(e.occurrence) === selected);
  const shownCompleted =
    view === 'Agenda' ? completed : completed.filter((s) => localDay(s.finishedAt) === selected);
  const items = [
    ...shownPlanned.map((e) => ({ at: e.occurrence, event: e, session: null })),
    ...shownCompleted.map((s) => ({ at: s.finishedAt, event: null, session: s })),
  ].sort((a, b) => a.at.localeCompare(b.at));
  function move(direction: number) {
    const next = new Date(date);
    if (view === 'Month') {
      next.setDate(1);
      next.setMonth(next.getMonth() + direction);
    } else next.setDate(next.getDate() + direction * (view === 'Week' ? 7 : 30));
    setDate(next);
    setSelected(localDay(next));
  }
  const addDate = new Date(`${selected}T10:00:00`);
  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAKE ROOM FOR GOOD HABITS</span>
          <h1>A little plan. A happier pup.</h1>
          <p className="muted">Training, check-ups, and all the moments in between.</p>
        </div>
        <Button onClick={() => onEdit({ date: addDate })}>
          <Plus size={18} /> Add appointment
        </Button>
      </div>
      <section className="card calendar-card">
        <div className="calendar-toolbar">
          <div className="row">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous period"
              onClick={() => move(-1)}
            >
              <ChevronLeft />
            </Button>
            <h2>{date.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h2>
            <Button variant="ghost" size="icon" aria-label="Next period" onClick={() => move(1)}>
              <ChevronRight />
            </Button>
          </div>
          <div className="row wrap">
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                const now = new Date();
                setDate(now);
                setSelected(localDay(now));
              }}
            >
              Today
            </Button>
            <div className="segmented" aria-label="Calendar view">
              {(['Month', 'Week', 'Agenda'] as const).map((item) => (
                <button
                  key={item}
                  aria-pressed={view === item}
                  className={view === item ? 'active' : ''}
                  onClick={() => {
                    setDate(new Date(`${selected}T12:00:00`));
                    setView(item);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        {view !== 'Agenda' && (
          <>
            <div className="calendar-grid weekdays">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className={`calendar-grid ${view.toLowerCase()}`}>
              {days.map((day) => {
                const key = localDay(day);
                const count = planned.filter((e) => localDay(e.occurrence) === key).length;
                const done = completed.filter((s) => localDay(s.finishedAt) === key).length;
                return (
                  <button
                    key={key}
                    aria-label={`${day.toLocaleDateString('en', { dateStyle: 'full' })}, ${count} appointments, ${done} completed sessions`}
                    aria-pressed={selected === key}
                    className={`calendar-day ${day.getMonth() !== date.getMonth() ? 'outside' : ''} ${key === selected ? 'selected' : ''} ${key === localDay(new Date()) ? 'today' : ''}`}
                    onClick={() => setSelected(key)}
                  >
                    <span>{day.getDate()}</span>
                    <div className="event-dots">
                      {count > 0 && <i className="planned-dot" />}
                      {done > 0 && <i className="done-dot" />}
                    </div>
                    {count + done > 0 && (
                      <small>
                        {count + done} {count + done === 1 ? 'event' : 'events'}
                      </small>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
        <div className="calendar-legend">
          <span>
            <i className="planned-dot" /> Planned
          </span>
          <span>
            <i className="done-dot" /> Completed
          </span>
          <small>Times: {Intl.DateTimeFormat().resolvedOptions().timeZone}</small>
        </div>
      </section>
      <section className="card agenda-card">
        <div className="section-heading">
          <h2>
            {view === 'Agenda'
              ? 'The next 30 days'
              : new Date(`${selected}T12:00:00`).toLocaleDateString('en', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
          </h2>
          <Button variant="ghost" size="small" onClick={() => onEdit({ date: addDate })}>
            <Plus size={16} /> Add
          </Button>
        </div>
        {!items.length && (
          <div className="empty-small">
            <span>🌱</span>
            <h3>A little breathing room.</h3>
            <p>No plans here yet. Add something good for your pup.</p>
          </div>
        )}
        {items.map((item) => (
          <button
            key={item.event ? `${item.event.id}:${item.at}` : item.session!.id}
            className="agenda-item"
            onClick={() =>
              item.event
                ? onEdit({ event: dog.events.find((e) => e.id === item.event!.id) })
                : onSession(item.session!)
            }
          >
            <span className={`agenda-icon ${item.session ? 'sage' : 'peach'}`}>
              {item.session ? <CheckCircle2 size={21} /> : <Clock3 size={21} />}
            </span>
            <div>
              <strong>{item.event?.title || lessonById(item.session!.lessonId)?.title}</strong>
              <p>
                {new Date(item.at).toLocaleString('en', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}{' '}
                · {item.event?.kind || 'Completed practice'}
                {item.event?.repeat !== 'none' && item.event && <Repeat2 size={13} />}
              </p>
              {(item.session || item.event?.lessonId) && (
                <div
                  className="mini-progress"
                  role="progressbar"
                  aria-label="Practice progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={
                    item.session?.progressSnapshot ??
                    progressFor(dog.sessions, item.event!.lessonId!).percent
                  }
                >
                  <span
                    style={{
                      width: `${item.session?.progressSnapshot ?? progressFor(dog.sessions, item.event!.lessonId!).percent}%`,
                    }}
                  />
                </div>
              )}
            </div>
            <span className="badge">
              {item.session ? `${item.session.progressSnapshot}%` : 'Planned'}
            </span>
            <ChevronRight size={17} />
          </button>
        ))}
      </section>
    </>
  );
}
