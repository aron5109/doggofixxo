import { createRoot } from 'react-dom/client';
import { Mellowoof } from '@/components/mellowoof';
import { SignIn } from '@/components/sign-in';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import '@/app/globals.css';

const path = location.pathname;
createRoot(document.getElementById('root')!).render(
  path === '/signed-out' ? (
    <SignIn available />
  ) : path === '/unavailable' ? (
    <SignIn available={false} />
  ) : path === '/auth-error' ? (
    <SignIn available error="We couldn’t complete sign-in. Please try again." />
  ) : (
    <Mellowoof account={{ name: 'Browser test account' }} />
  ),
);
