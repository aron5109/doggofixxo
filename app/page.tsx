import { auth } from '@/auth';
import { cloudConfigured } from '@/lib/cloud';
import { Mellowoof } from '@/components/mellowoof';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const session = cloudConfigured ? await auth() : null;
  return (
    <Mellowoof
      cloudEnabled={cloudConfigured}
      account={session?.user ? { name: session.user.name || 'Your account' } : null}
    />
  );
}
