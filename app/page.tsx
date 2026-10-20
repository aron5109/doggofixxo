import { auth } from '@/auth';
import { cloudConfigured } from '@/lib/cloud';
import { Mellowoof } from '@/components/mellowoof';
import { SignIn } from '@/components/sign-in';
export const dynamic = 'force-dynamic';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!cloudConfigured) return <SignIn available={false} />;
  const session = await auth();
  if (!session?.user) {
    const { error } = await searchParams;
    const message = !error
      ? undefined
      : error === 'OAuthAccountNotLinked'
        ? 'Please use the Google account you originally signed up with.'
        : error === 'AccessDenied'
          ? 'Google sign-in wasn’t completed. Please try again with an allowed account.'
          : 'We couldn’t complete sign-in. Please try again.';
    return <SignIn available error={message} />;
  }
  return <Mellowoof account={{ name: session.user.name || 'Your account' }} />;
}
