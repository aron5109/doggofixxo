import { getCloudConfigurationStatus } from '@/lib/cloud';

export const dynamic = 'force-dynamic';

// Operator diagnostics: setting names and public deployment metadata only.
// This does not query accounts, connect to the database, or disclose credential values.
export function GET() {
  const { configured, missing, invalid } = getCloudConfigurationStatus();
  return Response.json(
    {
      status: configured ? 'configuration_ready' : 'configuration_needed',
      environment: process.env.VERCEL_ENV || 'development',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
      missing,
      invalid,
    },
    { status: configured ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  );
}
