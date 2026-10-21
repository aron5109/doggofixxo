'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  Check,
  ArrowRight,
  CalendarPlus,
  ShieldCheck,
  X,
} from 'lucide-react';
import { type Lesson, durationMinutes, lessonById } from '@/lib/lessons';
import {
  type Dog,
  type TrainingSession,
  progressFor,
  remainingSeconds,
  localDay,
} from '@/lib/model';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
import { DogArt } from './dog-art';
export function LessonPlayer({
  lesson,
  dog,
  onClose,
  onSave,
  onSchedule,
  onSelectLesson,
}: {
  lesson: Lesson;
  dog: Dog;
  onClose: () => void;
  onSave: (session: TrainingSession) => boolean;
  onSchedule: (lesson: Lesson, outcome: TrainingSession['outcome']) => void;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const [phase, setPhase] = useState<'overview' | 'training' | 'feedback' | 'done'>('overview');
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(lesson.steps[0].seconds);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const [outcome, setOutcome] = useState<TrainingSession['outcome'] | null>(null);
  const [observed, setObserved] = useState(false);
  const [notes, setNotes] = useState('');
  const [closing, setClosing] = useState(false);
  const startedAt = useRef<Date | null>(null);
  const sessionId = useRef(crypto.randomUUID());
  const saved = useRef(false);
  const elapsed = useRef(0);
  const runningSince = useRef<number | null>(null);
  const progress = progressFor(dog.sessions, lesson.id);
  const prerequisites = lesson.prerequisites.flatMap((id) => {
    const prerequisite = lessonById(id);
    return prerequisite ? [prerequisite] : [];
  });
  const step = lesson.steps[index];
  const remaining = remainingSeconds(deadline, seconds, tick);
  useEffect(() => {
    if (!deadline) return;
    const update = () => setTick(Date.now());
    const timer = setInterval(update, 200);
    document.addEventListener('visibilitychange', update);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, [deadline]);
  function pauseClock() {
    if (runningSince.current)
      elapsed.current += Math.min((Date.now() - runningSince.current) / 1000, seconds);
    runningSince.current = null;
    setSeconds(remainingSeconds(deadline, seconds));
    setDeadline(null);
  }
  function next() {
    pauseClock();
    if (index < 2) {
      setIndex(index + 1);
      setSeconds(lesson.steps[index + 1].seconds);
    } else setPhase('feedback');
  }
  function finish() {
    pauseClock();
    setPhase('feedback');
  }
  function save() {
    if (!outcome || saved.current) return;
    const now = new Date();
    const result = onSave({
      id: sessionId.current,
      lessonId: lesson.id,
      startedAt: (startedAt.current || now).toISOString(),
      finishedAt: now.toISOString(),
      day: localDay(now),
      duration: Math.min(86400, Math.round(elapsed.current)),
      outcome,
      observed: outcome === 'great' && observed,
      milestone: progress.milestone,
      notes,
      progressSnapshot: progress.percent,
    });
    if (result) {
      saved.current = true;
      setPhase('done');
    }
  }
  function close() {
    if (phase === 'training' || phase === 'feedback') {
      pauseClock();
      setClosing(true);
    } else onClose();
  }
  return (
    <>
      <Modal
        open
        title={lesson.title}
        description={`${lesson.category} · ${durationMinutes(lesson)} gentle minutes`}
        onClose={close}
      >
        {phase === 'overview' && (
          <div className="lesson-overview">
            <div className="lesson-intro">
              <span className="eyebrow">{lesson.level.toUpperCase()} · AT YOUR DOG’S PACE</span>
              <h3>{lesson.subtitle}</h3>
              <p>{lesson.objective}</p>
            </div>
            <div className="safety-note">
              <ShieldCheck size={23} />
              <p>{lesson.safety}</p>
            </div>
            <section className="lesson-readiness" aria-labelledby="lesson-readiness-title">
              <h3 id="lesson-readiness-title">Before this lesson</h3>
              <p>{lesson.readiness}</p>
              {prerequisites.length > 0 && (
                <>
                  <h4>Skills to build on</h4>
                  <ul className="prerequisite-list">
                    {prerequisites.map((prerequisite) => (
                      <li key={prerequisite.id}>
                        <button onClick={() => onSelectLesson(prerequisite)}>
                          {prerequisite.title} <ArrowRight size={14} aria-hidden="true" />
                        </button>
                        <small>
                          {progressFor(dog.sessions, prerequisite.id).complete
                            ? 'Milestones recorded'
                            : 'Suggested earlier practice'}
                        </small>
                      </li>
                    ))}
                  </ul>
                  <p className="small muted">
                    Readiness means comfortable skills today; recorded progress is only a guide.
                  </p>
                </>
              )}
            </section>
            <h3>You’ll need</h3>
            <div className="tags">
              {lesson.equipment.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
            <h3>Before you start</h3>
            <p>{lesson.preparation}</p>
            <ol className="step-preview">
              {lesson.steps.map((s, i) => (
                <li key={s.title}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <small>
                      {Math.ceil(s.seconds / 60)} min guide · {s.success}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
            <details>
              <summary>Comfort, difficulty & rewards</summary>
              <h4>Signs to pause</h4>
              <p>{lesson.discomfort}</p>
              <h4>Make it easier</h4>
              <p>{lesson.easier}</p>
              <h4>When to build up</h4>
              <p>{lesson.harder}</p>
              <h4>Rewards</h4>
              <p>{lesson.reinforcement}</p>
            </details>
            <details>
              <summary>Why this approach?</summary>
              <p>{lesson.evidence}</p>
            </details>
            <p className="small muted">
              These approaches complement each other; select the exercise that fits the trigger and
              your dog’s comfort. Clinical separation treatment may need a specialist.
            </p>
            <div className="actions">
              <Button
                onClick={() => {
                  startedAt.current = new Date();
                  setPhase('training');
                }}
              >
                <Play size={18} /> Let’s practise
              </Button>
              <Button variant="secondary" onClick={() => onSchedule(lesson, 'progress')}>
                <CalendarPlus size={18} /> Schedule
              </Button>
            </div>
          </div>
        )}
        {phase === 'training' && (
          <div className="training-view">
            <span className="eyebrow">STEP {index + 1} OF 3</span>
            <div className="step-dots">
              {lesson.steps.map((s, i) => (
                <span key={s.title} className={i <= index ? 'active' : ''} />
              ))}
            </div>
            <h3>{step.title}</h3>
            <p>{step.instruction}</p>
            <div className="timer" role="timer" aria-label="Time remaining">
              {String(Math.floor(remaining / 60)).padStart(2, '0')}
              <span>:</span>
              {String(remaining % 60).padStart(2, '0')}
            </div>
            <p className="timer-caption">
              {remaining === 0
                ? 'Time to check in. Continue only if your dog is comfortable.'
                : 'The timer is a guide. Your dog sets the pace.'}
            </p>
            <div className="timer-controls">
              <Button
                onClick={() => {
                  if (deadline) pauseClock();
                  else {
                    const now = Date.now();
                    runningSince.current = now;
                    setTick(now);
                    setDeadline(now + seconds * 1000);
                  }
                }}
                disabled={remaining === 0}
              >
                {deadline ? (
                  <>
                    <Pause size={18} /> Pause
                  </>
                ) : (
                  <>
                    <Play size={18} /> {seconds === step.seconds ? 'Start' : 'Resume'}
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={next}>
                <SkipForward size={18} /> {index === 2 ? 'Finish steps' : 'Skip / next'}
              </Button>
            </div>
            <div className="success-note">
              <Check size={20} />
              <div>
                <strong>Look for this</strong>
                <p>{step.success}</p>
              </div>
            </div>
            <details>
              <summary>Does your dog need a break?</summary>
              <p>{lesson.discomfort}</p>
              <p>{lesson.easier}</p>
            </details>
            <Button className="full" variant="ghost" onClick={finish}>
              Finish session early
            </Button>
          </div>
        )}
        {phase === 'feedback' && (
          <div className="feedback">
            <DogArt avatar={dog.avatar} className="feedback-dog" />
            <h3>How did {dog.name} do?</h3>
            <p className="muted">Every observation helps. There’s no wrong answer.</p>
            <div className="feedback-options">
              {(
                [
                  ['great', '🌟', 'Great!'],
                  ['progress', '🌱', 'A little progress'],
                  ['difficult', '☁️', 'Too difficult'],
                ] as const
              ).map(([value, emoji, label]) => (
                <button
                  className={outcome === value ? 'selected' : ''}
                  key={value}
                  aria-label={label}
                  onClick={() => {
                    setOutcome(value);
                    setObserved(value === 'great');
                  }}
                  aria-pressed={outcome === value}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
            {outcome === 'great' && !progress.complete && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={observed}
                  onChange={(e) => setObserved(e.target.checked)}
                />
                <span>
                  I observed this comfortably:{' '}
                  <strong>{lesson.steps[progress.milestone].success}</strong>
                </span>
              </label>
            )}
            {outcome === 'difficult' && (
              <div className="safety-note">
                <p>
                  Let’s rest for now. Next time, shorten the exercise or make it easier. If distress
                  persists, ask your vet or a qualified behaviour professional.
                </p>
              </div>
            )}
            <label className="left">
              Anything you noticed? (optional)
              <textarea
                maxLength={1000}
                rows={3}
                placeholder="Small wins, little worries…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>
            <p className="small muted">
              Each saved Great session with the comfortable criterion checked adds one of six
              progress steps, including sessions on the same day. Timers alone do not add progress.
            </p>
            <Button className="full" disabled={!outcome} onClick={save}>
              Save our little step <Check size={18} />
            </Button>
          </div>
        )}
        {phase === 'done' && (
          <div className="feedback">
            <DogArt
              avatar={dog.avatar}
              mood={outcome === 'difficult' ? 'sleepy' : 'happy'}
              className="feedback-dog"
            />
            <span className="eyebrow">SESSION SAVED</span>
            <p className="progress-result" role="status">
              {progress.percent}% lesson progress · {progress.successes}/6 comfortable Great
              sessions
            </p>
            <h3>
              {outcome === 'difficult'
                ? 'A little rest is a good step.'
                : 'Every little step counts.'}
            </h3>
            <p>
              {outcome === 'difficult'
                ? 'Give your pup a comfortable break. Your next suggestion is in two days, with an easier exercise.'
                : progress.complete
                  ? 'Milestones complete! Keep those good habits growing with optional weekly practice.'
                  : 'Your pup is learning. So are you. Every comfortable, recorded success builds progress.'}
            </p>
            <div className="actions">
              <Button onClick={() => onSchedule(lesson, outcome!)}>
                <CalendarPlus size={18} />{' '}
                {progress.complete ? 'Plan maintenance' : 'Plan next session'}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                All done <ArrowRight size={17} />
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={closing}
        title="Leave this practice?"
        description="This unfinished session has not been saved."
        onClose={() => setClosing(false)}
      >
        <p>
          You can return to the session and record how your dog felt, including if it was too
          difficult.
        </p>
        <div className="actions">
          <Button onClick={() => setClosing(false)}>Keep practising</Button>
          <Button variant="danger" onClick={onClose}>
            <X size={17} /> Discard session
          </Button>
        </div>
      </Modal>
    </>
  );
}
