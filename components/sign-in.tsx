'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { ArrowRight, Cloud, ShieldCheck } from 'lucide-react';
import { DogArt } from './dog-art';
import { Button } from './ui/button';
import { BrandLogo } from './brand-logo';

export function SignIn({ available, error }: { available: boolean; error?: string }) {
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  async function connect() {
    setPending(true);
    setFailure('');
    try {
      await signIn('google', { redirectTo: '/' });
    } catch {
      setFailure('We couldn’t open Google sign-in. Please try again.');
      setPending(false);
    }
  }
  return (
    <main id="main" className="welcome sign-in-screen">
      <div className="welcome-brand">
        <BrandLogo priority />
      </div>
      <section className="onboarding-card centered" aria-labelledby="sign-in-title">
        <div className="welcome-art" aria-hidden="true">
          <DogArt avatar={0} decorative />
          <span className="floating-heart">♡</span>
          <span className="sparkle">✧</span>
        </div>
        <span className="eyebrow">A LITTLE KINDNESS. EVERY DAY.</span>
        <h1 id="sign-in-title">
          {available ? 'A happier little world for your dog.' : 'We’ll be with you soon.'}
        </h1>
        <p className="intro-copy">
          {available
            ? 'Kind training, thoughtful routines, and little moments of progress. Sign in to keep your dogs, lessons and calendar together, wherever you are.'
            : 'Sign-in is temporarily unavailable. Please check back in a little while.'}
        </p>
        {(failure || error) && (
          <p role="alert" className="sign-in-error">
            {failure || error}
          </p>
        )}
        {available ? (
          <Button onClick={() => void connect()} disabled={pending} aria-busy={pending}>
            {pending ? 'Opening Google…' : 'Continue with Google'} <ArrowRight size={18} />
          </Button>
        ) : (
          <Button onClick={() => location.reload()}>Check again</Button>
        )}
        <p className="small muted">
          <Cloud size={14} aria-hidden="true" /> Your records stay private in your account.
        </p>
      </section>
      <p className="welcome-footer">
        <ShieldCheck size={16} aria-hidden="true" /> Gentle practice. A little at a time.
      </p>
    </main>
  );
}
