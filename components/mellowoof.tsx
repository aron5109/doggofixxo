'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn, signOut } from 'next-auth/react';
import { motion, MotionConfig } from 'motion/react';
import {
  Home,
  BookOpen,
  CalendarDays,
  Lightbulb,
  UserRound,
  PawPrint,
  Plus,
  ArrowRight,
  ChevronRight,
  Heart,
  Clock3,
  Download,
  Upload,
  LogOut,
  ShieldCheck,
  Sprout,
  Check,
  Search,
  Bell,
  Edit3,
  Trash2,
  ExternalLink,
  Cloud,
  Menu,
  X,
} from 'lucide-react';
import { useStore, downloadBackup } from '@/lib/use-store';
import {
  type Profile,
  type TrainingSession,
  type AppState,
  categories,
  addDog,
  updateDog,
  recordSession,
  progressFor,
  nextPractice,
  plusDays,
  occurrences,
  parseBackup,
} from '@/lib/model';
import { type Lesson, lessons, categoryMeta, durationMinutes, lessonById } from '@/lib/lessons';
import { tips, tipGroups } from '@/lib/tips';
import { references } from '@/lib/references';
import { Onboarding, ProfileFields, ConcernFields } from './onboarding';
import { DogArt } from './dog-art';
import { Button } from './ui/button';
import { Modal } from './ui/dialog';
import { LessonPlayer } from './lesson-player';
import { Calendar, EventEditor, type EventDraft } from './calendar';
type View = 'Home' | 'Training' | 'Calendar' | 'Tips' | 'Profile';
const navItems = [
  { label: 'Home', icon: Home },
  { label: 'Training', icon: BookOpen },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Tips', icon: Lightbulb },
  { label: 'Profile', icon: UserRound },
] as const;
export function Mellowoof({ account }: { account: { name: string } }) {
  const { state, commit, ready, error, pending, sessionExpired } = useStore();
  const [view, setView] = useState<View>('Home');
  const [adding, setAdding] = useState(false);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [eventDraft, setEventDraft] = useState<EventDraft | null>(null);
  const [editProfile, setEditProfile] = useState<Profile | null>(null);
  const [deleteDog, setDeleteDog] = useState(false);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [tipCategory, setTipCategory] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [tipQuery, setTipQuery] = useState('');
  const [imported, setImported] = useState<AppState | null>(null);
  const [notice, setNotice] = useState('');
  const [sessionDetail, setSessionDetail] = useState<TrainingSession | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const dog = state.dogs.find((d) => d.id === state.activeDogId) || state.dogs[0];
  useEffect(() => {
    if ('serviceWorker' in navigator)
      void navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);
  function navigate(next: View) {
    setView(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function confirmDog(profile: Profile) {
    try {
      if (commit(addDog(state, profile))) {
        setAdding(false);
        setCategory('All');
        navigate('Training');
      }
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : 'Could not create this profile.');
    }
  }
  async function importFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 8_000_000) throw new Error('Please use a backup smaller than 8 MB.');
      setImported(parseBackup(await file.text()));
    } catch {
      setNotice(
        'That file is not a valid Mellowoof backup, or it exceeds the 8 MB limit. Your current records are unchanged.',
      );
    }
  }
  function schedule(selected: Lesson, outcome: TrainingSession['outcome']) {
    if (!dog) return;
    const complete = progressFor(dog.sessions, selected.id).complete;
    setLesson(null);
    setEventDraft({
      lessonId: selected.id,
      date: nextPractice(outcome, complete),
      maintenance: complete,
    });
  }
  const accountBanner = (
    <div className="account-banner" role="status">
      <Cloud size={14} aria-hidden="true" />
      {error
        ? 'Your account needs attention'
        : !ready
          ? 'Opening your account…'
          : pending
            ? 'Saving to your account…'
            : 'All changes saved to your account'}
    </div>
  );
  const alerts = (
    <>
      {error && (
        <div role="alert" className="error-banner">
          {error}
          {ready && (
            <Button variant="ghost" size="small" onClick={() => downloadBackup(state)}>
              Export backup
            </Button>
          )}
          {sessionExpired && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => void signIn('google', { redirectTo: '/' })}
            >
              Sign in again
            </Button>
          )}
          <Button variant="ghost" size="small" onClick={() => location.reload()}>
            Try again
          </Button>
          {!ready && !sessionExpired && (
            <Button variant="ghost" size="small" onClick={() => void signOut({ redirectTo: '/' })}>
              Sign out
            </Button>
          )}
        </div>
      )}
      {notice && (
        <div role="status" className="notice-banner">
          {notice}
          <button aria-label="Dismiss notice" onClick={() => setNotice('')}>
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
  const importDialog = (
    <Modal
      open={Boolean(imported)}
      title="Import this backup?"
      description="This replaces records in your account. It does not merge them."
      onClose={() => setImported(null)}
    >
      <p>
        {imported?.dogs.length} dog profiles and{' '}
        {imported?.dogs.reduce((sum, d) => sum + d.sessions.length, 0)} practice sessions found.
        Export your current records first if you want to keep them.
      </p>
      <div className="actions">
        <Button
          onClick={() => {
            if (imported && commit(imported)) {
              setImported(null);
              setNotice('Your backup was imported.');
            }
          }}
        >
          Replace with backup
        </Button>
        <Button variant="secondary" onClick={() => downloadBackup(state)}>
          Export current records
        </Button>
      </div>
    </Modal>
  );
  if (!ready)
    return (
      <>
        {accountBanner}
        {alerts}
        <div id="main" className="loading-screen">
          <PawPrint size={38} />
          <h1>{error ? 'Let’s keep your records safe.' : 'Finding your little steps…'}</h1>
          {!error && <p>Just a moment.</p>}
        </div>
        {importDialog}
      </>
    );
  if (!dog || adding)
    return (
      <>
        {accountBanner}
        {alerts}
        <Onboarding
          onConfirm={confirmDog}
          onCancel={adding && dog ? () => setAdding(false) : undefined}
        />
        {importDialog}
      </>
    );
  const recommended =
    lessons.find(
      (l) => dog.concerns.includes(l.category) && !progressFor(dog.sessions, l.id).complete,
    ) || lessons[0];
  const currentProgress = progressFor(dog.sessions, recommended.id);
  const startedLessons = lessons.filter((l) => dog.sessions.some((s) => s.lessonId === l.id));
  const overall = startedLessons.length
    ? Math.round(
        startedLessons.reduce((sum, l) => sum + progressFor(dog.sessions, l.id).percent, 0) /
          startedLessons.length,
      )
    : 0;
  const successful = dog.sessions.filter((s) => s.outcome === 'great' && s.observed).length;
  const upcoming = occurrences(dog.events, new Date(), plusDays(new Date(), 30)).slice(0, 3);
  const latestObservation = dog.sessions.at(-1);
  const restUntil =
    latestObservation?.outcome === 'difficult'
      ? nextPractice('difficult', false, new Date(latestObservation.finishedAt))
      : null;
  const needsRest = restUntil !== null && restUntil > new Date();
  const dailyTip =
    tips[
      Math.floor(
        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() /
          86400000,
      ) % tips.length
    ];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  function renderLessonCard(item: Lesson) {
    const progress = progressFor(dog.sessions, item.id);
    const meta = categoryMeta[item.category];
    return (
      <button key={item.id} className="lesson-card card" onClick={() => setLesson(item)}>
        <div className={`lesson-card-art ${meta.color}`}>
          <span>{meta.emoji}</span>
          <i>✧</i>
          <small>{item.category}</small>
        </div>
        <div className="lesson-card-body">
          <div className="row between">
            <span className="eyebrow">
              {durationMinutes(item)} MIN · {progress.complete ? 'MAINTENANCE' : 'FOUNDATION'}
            </span>
            <span className="circle-arrow">
              <ArrowRight size={17} />
            </span>
          </div>
          <h3>{item.title}</h3>
          <p>{item.subtitle}</p>
          <div className="lesson-card-progress">
            <div className="progress-track">
              <span style={{ width: `${progress.percent}%` }} />
            </div>
            <span>{progress.percent}%</span>
          </div>
        </div>
      </button>
    );
  }
  return (
    <MotionConfig reducedMotion="user">
      {accountBanner}
      <div className="app-layout">
        <aside className={`sidebar ${mobileMenu ? 'mobile-open' : ''}`}>
          <button className="brand" onClick={() => navigate('Home')} aria-label="Mellowoof home">
            <PawPrint size={31} fill="currentColor" />
            <span>
              mellowoof<small>Little steps. Happier tails.</small>
            </span>
          </button>
          <div className="sidebar-rule" />
          <span className="sidebar-label">YOUR LITTLE WORLD</span>
          <nav aria-label="Main navigation">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={view === label ? 'active' : ''}
                aria-current={view === label ? 'page' : undefined}
                onClick={() => navigate(label)}
              >
                <Icon size={21} />
                {label}
                {view === label && <span className="nav-dot" />}
              </button>
            ))}
          </nav>
          <div className="sidebar-kindness">
            <span>♡</span>
            <p>
              Progress looks different
              <br />
              for every pup.
            </p>
            <small>You’re doing better than you think.</small>
          </div>
          <button className="sidebar-profile" onClick={() => navigate('Profile')}>
            <div className="avatar-mini">
              <DogArt avatar={dog.avatar} decorative />
            </div>
            <div>
              <strong>{dog.name}’s little world</strong>
              <small>{account.name}</small>
            </div>
            <ChevronRight size={17} />
          </button>
        </aside>
        <div className="main-column">
          <header className="topbar">
            <div className="mobile-brand">
              <PawPrint size={23} fill="currentColor" /> mellowoof
            </div>
            <div className="breadcrumb">
              Your little world <ChevronRight size={13} />
              <strong>{view}</strong>
            </div>
            <div className="topbar-actions">
              <span className="today-label">
                {new Date().toLocaleDateString('en', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <button
                className="icon-button"
                aria-label="View upcoming appointments"
                onClick={() => navigate('Calendar')}
              >
                <Bell size={20} />
                {upcoming.length > 0 && <i />}
              </button>
              <label className="dog-switch">
                <span className="sr-only">Active dog</span>
                <select
                  aria-label="Active dog"
                  value={dog.id}
                  onChange={(e) => {
                    commit({ ...state, activeDogId: e.target.value });
                    setLesson(null);
                    setEventDraft(null);
                  }}
                >
                  {state.dogs.map((d) => (
                    <option value={d.id} key={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="mobile-menu icon-button"
                aria-label="Toggle navigation"
                aria-expanded={mobileMenu}
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? <X /> : <Menu />}
              </button>
            </div>
          </header>
          <main id="main" className="main-content">
            {alerts}
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'Home' && (
                <>
                  <div className="page-heading">
                    <div>
                      <span className="eyebrow">LITTLE STEPS. HAPPIER TAILS.</span>
                      <h1>
                        {greeting}, {dog.name}! <span className="heading-sun">☀</span>
                      </h1>
                      <p className="muted">
                        A little practice. A little patience. A whole lot of love.
                      </p>
                    </div>
                    <Button variant="secondary" onClick={() => setEventDraft({})}>
                      <Plus size={18} /> Add appointment
                    </Button>
                  </div>
                  <div className="dashboard-grid">
                    <section className="hero-card">
                      <div className="hero-copy">
                        <span className="pill">
                          <Sprout size={14} /> TODAY’S LITTLE STEP
                        </span>
                        <h2>
                          {needsRest ? (
                            <>
                              A little rest.
                              <br />A gentle reset.
                            </>
                          ) : (
                            <>
                              A calmer day
                              <br />
                              starts with you.
                            </>
                          )}
                        </h2>
                        <p>
                          {needsRest ? (
                            <>
                              That last practice felt tricky. Let’s rest now.
                              <br />
                              Next time, make the exercise easier.
                            </>
                          ) : (
                            <>
                              {recommended.subtitle}
                              <br />A few gentle minutes can go a long way.
                            </>
                          )}
                        </p>
                        <Button
                          onClick={() =>
                            needsRest ? schedule(recommended, 'difficult') : setLesson(recommended)
                          }
                        >
                          {needsRest ? 'Plan a gentler day' : 'Start training'}{' '}
                          <ArrowRight size={18} />
                        </Button>
                        <div className="hero-caption">
                          <Clock3 size={14} />{' '}
                          {needsRest
                            ? `Rest until ${restUntil!.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
                            : `${durationMinutes(recommended)} minutes · ${recommended.title}`}
                        </div>
                      </div>
                      <div className="hero-illustration">
                        <div className="hero-halo" />
                        <span className="art-sparkle s1">✧</span>
                        <span className="art-sparkle s2">✧</span>
                        <span className="art-heart">♡</span>
                        <DogArt avatar={dog.avatar} decorative />
                        <div className="grass g1">〃</div>
                        <div className="grass g2">〃</div>
                      </div>
                    </section>
                    <section className="card journey-card">
                      <span className="card-icon sage">
                        <Sprout size={22} />
                      </span>
                      <h2>Growing, together.</h2>
                      <p className="muted">Little wins make a big difference.</p>
                      <div
                        className="progress-circle"
                        style={{ '--progress': `${overall * 3.6}deg` } as React.CSSProperties}
                      >
                        <div>
                          <strong>
                            {overall}
                            <small>%</small>
                          </strong>
                          <span>foundation progress</span>
                        </div>
                      </div>
                      <div className="journey-stats">
                        <div>
                          <strong>{dog.sessions.length}</strong>
                          <span>practices</span>
                        </div>
                        <div>
                          <strong>{successful}</strong>
                          <span>observed wins</span>
                        </div>
                        <div>
                          <strong>{startedLessons.length}</strong>
                          <span>lessons tried</span>
                        </div>
                      </div>
                      <button className="text-link" onClick={() => navigate('Training')}>
                        See your progress <ArrowRight size={15} />
                      </button>
                      <small className="muted">Average across lessons you’ve practised.</small>
                    </section>
                    <section className="card continue-card">
                      <div className="section-heading">
                        <h2>Your training path</h2>
                        <button className="text-link" onClick={() => navigate('Training')}>
                          See all <ArrowRight size={15} />
                        </button>
                      </div>
                      <div className="current-lesson">
                        <span className={`card-icon ${categoryMeta[recommended.category].color}`}>
                          {categoryMeta[recommended.category].emoji}
                        </span>
                        <div>
                          <span className="small muted">{recommended.category}</span>
                          <h3>{recommended.title}</h3>
                          <p>
                            {currentProgress.complete
                              ? 'Foundation complete! Keep those good habits growing.'
                              : 'One comfortable moment at a time.'}
                          </p>
                        </div>
                      </div>
                      <div className="row between">
                        <span className="small">
                          {currentProgress.complete
                            ? 'Maintenance practice'
                            : `Milestone ${currentProgress.milestone + 1} of 3`}
                        </span>
                        <strong className="small green">{currentProgress.percent}%</strong>
                      </div>
                      <div className="progress-track">
                        <span style={{ width: `${currentProgress.percent}%` }} />
                      </div>
                      <p className="small muted">
                        Progress follows observed comfort over separate days.
                      </p>
                      <Button
                        variant="secondary"
                        className="full"
                        onClick={() =>
                          needsRest ? schedule(recommended, 'difficult') : setLesson(recommended)
                        }
                      >
                        {needsRest ? 'Plan a gentler next step' : 'Let’s take a little step'}{' '}
                        <ArrowRight size={16} />
                      </Button>
                    </section>
                    <section className="card upcoming-card">
                      <div className="section-heading">
                        <h2>Coming up</h2>
                        <button
                          className="icon-button"
                          aria-label="Open calendar"
                          onClick={() => navigate('Calendar')}
                        >
                          <CalendarDays size={19} />
                        </button>
                      </div>
                      {upcoming.length ? (
                        upcoming.map((event) => (
                          <button
                            className="upcoming-event"
                            key={`${event.id}-${event.occurrence}`}
                            onClick={() =>
                              setEventDraft({ event: dog.events.find((e) => e.id === event.id) })
                            }
                          >
                            <span className="date-tile">
                              <small>
                                {new Date(event.occurrence).toLocaleDateString('en', {
                                  month: 'short',
                                })}
                              </small>
                              <strong>{new Date(event.occurrence).getDate()}</strong>
                            </span>
                            <div>
                              <strong>{event.title}</strong>
                              <small>
                                {new Date(event.occurrence).toLocaleTimeString('en', {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}{' '}
                                · {event.kind}
                              </small>
                            </div>
                            <ChevronRight size={16} />
                          </button>
                        ))
                      ) : (
                        <div className="empty-small">
                          <CalendarDays size={29} />
                          <p>A little room for something good.</p>
                          <button className="text-link" onClick={() => setEventDraft({})}>
                            Plan a little moment <Plus size={15} />
                          </button>
                        </div>
                      )}
                    </section>
                    <section className="daily-tip-card">
                      <div className="row">
                        <span className="card-icon butter">
                          <Lightbulb size={22} />
                        </span>
                        <span className="eyebrow">A LITTLE WISDOM</span>
                        <button
                          className="favorite-button"
                          aria-label={
                            state.favorites.includes(dailyTip.id)
                              ? 'Unsave daily tip'
                              : 'Save daily tip'
                          }
                          aria-pressed={state.favorites.includes(dailyTip.id)}
                          onClick={() =>
                            commit({
                              ...state,
                              favorites: state.favorites.includes(dailyTip.id)
                                ? state.favorites.filter((id) => id !== dailyTip.id)
                                : [...state.favorites, dailyTip.id],
                            })
                          }
                        >
                          <Heart
                            size={20}
                            fill={state.favorites.includes(dailyTip.id) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                      <blockquote>“{dailyTip.text}”</blockquote>
                      <button className="text-link" onClick={() => navigate('Tips')}>
                        More little tips <ArrowRight size={15} />
                      </button>
                    </section>
                    <section className="kindness-card">
                      <Heart size={19} />
                      <p>
                        No perfect pups.
                        <br />
                        <strong>Just progress, together.</strong>
                      </p>
                      <DogArt avatar={(dog.avatar + 2) % 8} mood="sleepy" decorative />
                    </section>
                  </div>
                  <section className="explore-section">
                    <div className="section-heading">
                      <div>
                        <span className="eyebrow">FIND YOUR NEXT LITTLE STEP</span>
                        <h2>A little help with everyday life.</h2>
                      </div>
                    </div>
                    <div className="category-tiles">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            navigate('Training');
                          }}
                          className={categoryMeta[cat].color}
                        >
                          <span>{categoryMeta[cat].emoji}</span>
                          <strong>{cat}</strong>
                          <small>3 gentle lessons</small>
                          <ChevronRight size={15} />
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}
              {view === 'Training' && (
                <>
                  <div className="page-heading">
                    <div>
                      <span className="eyebrow">KIND TRAINING. REAL CONNECTION.</span>
                      <h1>Little lessons. Lasting habits.</h1>
                      <p className="muted">Choose a starting point. Your dog sets the pace.</p>
                    </div>
                    <span className="soft-badge">
                      <BookOpen size={16} /> 15 gentle lessons
                    </span>
                  </div>
                  <div className="library-note">
                    <ShieldCheck size={22} />
                    <p>
                      Train the behaviour. Understand the emotion. Reward progress.
                      <br />
                      <small>
                        Reward-based exercises, with space to pause and change your approach.
                      </small>
                    </p>
                  </div>
                  <div className="library-toolbar">
                    <div className="filter-chips" aria-label="Training category">
                      {['All', ...categories].map((cat) => (
                        <button
                          key={cat}
                          aria-pressed={category === cat}
                          className={category === cat ? 'active' : ''}
                          onClick={() => setCategory(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <label className="search-field">
                      <Search size={17} />
                      <input
                        aria-label="Search lessons"
                        placeholder="Find a little lesson…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </label>
                  </div>
                  {category !== 'All' && (
                    <p className="muted">
                      {categoryMeta[category as keyof typeof categoryMeta].description} These
                      exercises are complementary; switch to the one that fits the trigger.
                    </p>
                  )}
                  <div className="lesson-grid">
                    {lessons
                      .filter(
                        (l) =>
                          (category === 'All' || l.category === category) &&
                          `${l.title} ${l.subtitle}`.toLowerCase().includes(query.toLowerCase()),
                      )
                      .map(renderLessonCard)}
                  </div>
                  {!lessons.some(
                    (l) =>
                      (category === 'All' || l.category === category) &&
                      `${l.title} ${l.subtitle}`.toLowerCase().includes(query.toLowerCase()),
                  ) && (
                    <div className="empty-small">
                      <DogArt avatar={dog.avatar} className="empty-dog" />
                      <h2>No lessons found.</h2>
                      <p>Try another word or category.</p>
                    </div>
                  )}
                  {dog.sessions.length > 0 && (
                    <section className="card history-card">
                      <div className="section-heading">
                        <h2>Your recent little steps</h2>
                        <span className="small muted">Last 8 practices</span>
                      </div>
                      {[...dog.sessions]
                        .reverse()
                        .slice(0, 8)
                        .map((session) => (
                          <button
                            className="history-row"
                            key={session.id}
                            onClick={() => setSessionDetail(session)}
                          >
                            <span>
                              {session.outcome === 'great'
                                ? '🌟'
                                : session.outcome === 'progress'
                                  ? '🌱'
                                  : '☁️'}
                            </span>
                            <div>
                              <strong>{lessonById(session.lessonId)?.title || 'Practice'}</strong>
                              <small>
                                {new Date(session.finishedAt).toLocaleString('en', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </small>
                            </div>
                            <span className="badge">
                              {session.outcome === 'difficult'
                                ? 'Rest & reset'
                                : `${session.progressSnapshot}% foundation`}
                            </span>
                            <ChevronRight size={17} />
                          </button>
                        ))}
                    </section>
                  )}
                </>
              )}
              {view === 'Calendar' && (
                <Calendar dog={dog} onEdit={setEventDraft} onSession={setSessionDetail} />
              )}
              {view === 'Tips' && (
                <>
                  <div className="page-heading">
                    <div>
                      <span className="eyebrow">A LITTLE WISDOM, A LOT OF LOVE</span>
                      <h1>Good things to know.</h1>
                      <p className="muted">70 small ideas for a happier life together.</p>
                    </div>
                    <Button
                      variant={favoritesOnly ? 'default' : 'secondary'}
                      onClick={() => setFavoritesOnly(!favoritesOnly)}
                      aria-pressed={favoritesOnly}
                    >
                      <Heart size={17} /> Saved tips ({state.favorites.length})
                    </Button>
                  </div>
                  <div className="library-toolbar">
                    <label className="tip-category">
                      Category
                      <select
                        aria-label="Tip category"
                        value={tipCategory}
                        onChange={(e) => setTipCategory(e.target.value)}
                      >
                        {['All', ...Object.keys(tipGroups)].map((group) => (
                          <option key={group}>{group}</option>
                        ))}
                      </select>
                    </label>
                    <label className="search-field">
                      <Search size={17} />
                      <input
                        aria-label="Search tips"
                        placeholder="What’s on your mind?"
                        value={tipQuery}
                        onChange={(e) => setTipQuery(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="tips-grid">
                    {tips
                      .filter(
                        (tip) =>
                          (tipCategory === 'All' || tip.category === tipCategory) &&
                          (!favoritesOnly || state.favorites.includes(tip.id)) &&
                          tip.text.toLowerCase().includes(tipQuery.toLowerCase()),
                      )
                      .map((tip, i) => (
                        <article
                          key={tip.id}
                          className={`tip-card ${['butter', 'sage', 'peach', 'lavender'][i % 4]}`}
                        >
                          <div className="row between">
                            <span className="eyebrow">{tip.category}</span>
                            <button
                              className="favorite-button"
                              aria-label={`${state.favorites.includes(tip.id) ? 'Unsave' : 'Save'} tip: ${tip.text}`}
                              aria-pressed={state.favorites.includes(tip.id)}
                              onClick={() =>
                                commit({
                                  ...state,
                                  favorites: state.favorites.includes(tip.id)
                                    ? state.favorites.filter((id) => id !== tip.id)
                                    : [...state.favorites, tip.id],
                                })
                              }
                            >
                              <Heart
                                size={19}
                                fill={state.favorites.includes(tip.id) ? 'currentColor' : 'none'}
                              />
                            </button>
                          </div>
                          <p>{tip.text}</p>
                          <a href={references[tip.source].url} target="_blank" rel="noreferrer">
                            Read supporting guidance <ExternalLink size={13} />
                          </a>
                        </article>
                      ))}
                  </div>
                  {!tips.some(
                    (tip) =>
                      (tipCategory === 'All' || tip.category === tipCategory) &&
                      (!favoritesOnly || state.favorites.includes(tip.id)) &&
                      tip.text.toLowerCase().includes(tipQuery.toLowerCase()),
                  ) && (
                    <div className="empty-small">
                      <Heart size={30} />
                      <h2>{favoritesOnly ? 'Save a little wisdom.' : 'No tips found.'}</h2>
                      <p>
                        {favoritesOnly
                          ? 'Tap a heart on any tip to keep it here.'
                          : 'Try another word or category.'}
                      </p>
                    </div>
                  )}
                </>
              )}
              {view === 'Profile' && (
                <>
                  <div className="page-heading">
                    <div>
                      <span className="eyebrow">ONE OF A KIND. ALL YOURS.</span>
                      <h1>{dog.name}’s little world.</h1>
                      <p className="muted">A few details to make every step feel more personal.</p>
                    </div>
                    <Button onClick={() => setAdding(true)} disabled={state.dogs.length >= 12}>
                      <Plus size={18} /> Add another dog
                    </Button>
                  </div>
                  <div className="profile-grid">
                    <section className="card dog-profile-card">
                      {dog.photo ? (
                        <Image
                          src={dog.photo}
                          alt={dog.name}
                          width={180}
                          height={180}
                          unoptimized
                          className="profile-photo"
                        />
                      ) : (
                        <DogArt avatar={dog.avatar} className="profile-art" />
                      )}
                      <h2>{dog.name}</h2>
                      <p className="muted">{dog.breed}</p>
                      <div className="profile-facts">
                        <span>
                          <strong>{dog.age}</strong> years
                        </span>
                        <span>
                          <strong>{dog.weight}</strong> {dog.unit}
                        </span>
                        <span>{dog.sex}</span>
                      </div>
                      <p className="small muted">Neutered / spayed: {dog.neutered}</p>
                      <div className="tags">
                        {dog.concerns.map((c) => (
                          <span key={c} className="tag">
                            {c}
                          </span>
                        ))}
                      </div>
                      <Button
                        variant="secondary"
                        className="full"
                        onClick={() => setEditProfile(dog)}
                      >
                        <Edit3 size={17} /> Edit profile
                      </Button>
                      <Button
                        variant="ghost"
                        className="delete-link"
                        onClick={() => setDeleteDog(true)}
                      >
                        <Trash2 size={15} /> Remove this profile
                      </Button>
                    </section>
                    <div className="profile-settings">
                      <section className="card">
                        <span className="card-icon sage">
                          <Cloud size={22} />
                        </span>
                        <h2>Your account</h2>
                        <p>
                          Signed in as {account.name}. Your dogs, training sessions and appointments
                          are saved privately in your account.
                        </p>
                        <div className="actions">
                          <Button variant="secondary" onClick={() => downloadBackup(state)}>
                            <Download size={17} /> Export JSON
                          </Button>
                          <label className="btn btn-secondary import-button">
                            <Upload size={17} /> Import JSON
                            <input
                              type="file"
                              accept="application/json,.json"
                              onChange={(e) => {
                                void importFile(e.target.files?.[0]);
                                e.target.value = '';
                              }}
                            />
                          </label>
                        </div>
                        <p className="small muted">
                          Backups contain personal records. Store and share them carefully.
                          Importing replaces your account’s records.
                        </p>
                      </section>
                      <section className="card">
                        <h2>Keep your little world connected.</h2>
                        <p>
                          Your little steps stay with your Google account. Sign in with the same
                          account on another device to pick up where you left off.
                        </p>
                        <div className="actions">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              if (!pending && !error) void signOut({ redirectTo: '/' });
                              else setNotice('Export your unsaved changes before signing out.');
                            }}
                          >
                            <LogOut size={17} /> Sign out
                          </Button>
                        </div>
                      </section>
                      <section className="card gentle-promise">
                        <ShieldCheck size={24} />
                        <div>
                          <h3>Kindness is our starting point.</h3>
                          <p>
                            Mellowoof supports reward-based practice. It does not diagnose or
                            replace veterinary care. For pain, sudden behaviour changes or
                            persistent distress, seek qualified help.
                          </p>
                        </div>
                      </section>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
            <footer className="app-footer">
              <span>
                <PawPrint size={14} /> Little steps. Happier tails.
              </span>
              <small>Made with kindness, for you and your pup.</small>
            </footer>
          </main>
        </div>
      </div>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            aria-current={view === label ? 'page' : undefined}
            className={view === label ? 'active' : ''}
            onClick={() => navigate(label)}
          >
            <Icon size={21} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      {lesson && (
        <LessonPlayer
          key={`${dog.id}-${lesson.id}`}
          lesson={lesson}
          dog={dog}
          onClose={() => setLesson(null)}
          onSave={(session) => commit(recordSession(state, dog.id, session))}
          onSchedule={schedule}
        />
      )}
      {eventDraft && (
        <EventEditor
          draft={eventDraft}
          onClose={() => setEventDraft(null)}
          onSave={(event) => {
            if (
              commit(
                updateDog(state, dog.id, (d) => ({
                  ...d,
                  events: [...d.events.filter((e) => e.id !== event.id), event],
                })),
              )
            ) {
              setEventDraft(null);
              setNotice('Your little plan is saved.');
            }
          }}
          onDelete={(id) => {
            if (
              commit(
                updateDog(state, dog.id, (d) => ({
                  ...d,
                  events: d.events.filter((e) => e.id !== id),
                })),
              )
            )
              setEventDraft(null);
          }}
        />
      )}
      <Modal
        open={Boolean(editProfile)}
        title={`A little about ${dog.name}`}
        onClose={() => setEditProfile(null)}
      >
        {editProfile && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (commit(updateDog(state, dog.id, (d) => ({ ...d, ...editProfile })))) {
                setEditProfile(null);
                setNotice('Profile updated.');
              }
            }}
          >
            <ProfileFields value={editProfile} onChange={setEditProfile} />
            <ConcernFields value={editProfile} onChange={setEditProfile} />
            <Button type="submit" className="full" disabled={!editProfile.concerns.length}>
              Save profile <Check size={17} />
            </Button>
          </form>
        )}
      </Modal>
      <Modal
        open={deleteDog}
        title={`Remove ${dog.name}’s profile?`}
        description="This removes this dog’s sessions and appointments from your account."
        onClose={() => setDeleteDog(false)}
      >
        <p>
          Export a backup first if you want to keep these records. Other dogs will stay in your
          little world.
        </p>
        <div className="actions">
          <Button
            variant="danger"
            onClick={() => {
              const dogs = state.dogs.filter((d) => d.id !== dog.id);
              if (commit({ ...state, dogs, activeDogId: dogs[0]?.id || null })) setDeleteDog(false);
            }}
          >
            Remove profile
          </Button>
          <Button variant="secondary" onClick={() => setDeleteDog(false)}>
            Keep my pup
          </Button>
        </div>
      </Modal>
      <Modal
        open={Boolean(sessionDetail)}
        title={
          sessionDetail
            ? lessonById(sessionDetail.lessonId)?.title || 'Your practice'
            : 'Your practice'
        }
        description="A little moment, recorded."
        onClose={() => setSessionDetail(null)}
      >
        {sessionDetail && (
          <>
            <span className="badge">
              {sessionDetail.outcome === 'great'
                ? 'Great!'
                : sessionDetail.outcome === 'progress'
                  ? 'A little progress'
                  : 'Too difficult'}
            </span>
            <p>
              {new Date(sessionDetail.finishedAt).toLocaleString('en', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
            <p>
              {Math.floor(sessionDetail.duration / 60)}m {sessionDetail.duration % 60}s active
              practice · {sessionDetail.progressSnapshot}% foundation at this session
            </p>
            <p>
              {sessionDetail.observed
                ? 'Success criterion observed comfortably.'
                : 'Observation saved; no milestone credit from this result.'}
            </p>
            {sessionDetail.notes && (
              <blockquote className="session-notes">{sessionDetail.notes}</blockquote>
            )}
            {sessionDetail.outcome === 'difficult' && (
              <div className="safety-note">
                <p>
                  Rest now. Make the next practice easier and shorter. Persistent distress deserves
                  professional support.
                </p>
              </div>
            )}
            <p className="small muted">
              A completed foundation is a starting point for maintenance, not a guarantee that a
              behaviour is permanently resolved.
            </p>
          </>
        )}
      </Modal>
      {importDialog}
    </MotionConfig>
  );
}
