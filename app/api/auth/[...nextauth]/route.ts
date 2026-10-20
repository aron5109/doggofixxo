import { handlers } from '@/auth';
import { cloudConfigured } from '@/lib/cloud';
const unavailable = () =>
  Response.json(
    { error: 'Sign-in is temporarily unavailable. Please try again later.' },
    { status: 503 },
  );
export const GET = cloudConfigured ? handlers.GET : unavailable;
export const POST = cloudConfigured ? handlers.POST : unavailable;
