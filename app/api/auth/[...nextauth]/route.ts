import { handlers } from '@/auth';
import { cloudConfigured } from '@/lib/cloud';
const unavailable = () =>
  Response.json(
    { error: 'Google sign-in is not configured. Local demo is available.' },
    { status: 503 },
  );
export const GET = cloudConfigured ? handlers.GET : unavailable;
export const POST = cloudConfigured ? handlers.POST : unavailable;
