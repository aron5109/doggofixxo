import { auth } from '@/auth';
import { db } from '@/db';
import { userData } from '@/db/schema';
import { cloudConfigured, requireOwner } from '@/lib/cloud';
import { emptyState, stateSchema } from '@/lib/model';
import { eq, and, sql } from 'drizzle-orm';
import { z } from 'zod';
export const dynamic = 'force-dynamic';
async function owner() {
  return cloudConfigured && db ? (await auth())?.user?.id : null;
}
export async function GET() {
  const userId = await owner();
  if (!userId || !db)
    return Response.json({ error: 'Sign in to access your cloud records.' }, { status: 401 });
  const [record] = await db
    .select()
    .from(userData)
    .where(eq(userData.userId, requireOwner(userId)));
  return Response.json(
    { state: record?.state ?? emptyState(), revision: record?.revision ?? 0 },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
const putSchema = z.object({ state: stateSchema, revision: z.number().int().nonnegative() });
export async function PUT(request: Request) {
  const userId = await owner();
  if (!userId || !db)
    return Response.json({ error: 'Sign in to save your cloud records.' }, { status: 401 });
  // Same-origin JSON requests only; never accept an owner from the request body.
  if (
    !request.headers.get('origin') ||
    request.headers.get('origin') !== new URL(request.url).origin
  )
    return Response.json({ error: 'Invalid origin.' }, { status: 403 });
  if (!request.headers.get('content-type')?.startsWith('application/json'))
    return Response.json({ error: 'JSON is required.' }, { status: 415 });
  if (Number(request.headers.get('content-length') ?? 0) > 8_000_000)
    return Response.json({ error: 'Backup too large.' }, { status: 413 });
  const body = await request.text();
  if (body.length > 8_000_000)
    return Response.json({ error: 'Backup too large.' }, { status: 413 });
  let parsed;
  try {
    parsed = putSchema.parse(JSON.parse(body));
  } catch {
    return Response.json({ error: 'Invalid Mellowoof data.' }, { status: 400 });
  }
  const ownerId = requireOwner(userId);
  const result = await db.transaction(async (tx) => {
    await tx
      .insert(userData)
      .values({ userId: ownerId, state: emptyState(), revision: 0 })
      .onConflictDoNothing();
    const [saved] = await tx
      .update(userData)
      .set({ state: parsed.state, revision: sql`${userData.revision} + 1`, updatedAt: new Date() })
      .where(and(eq(userData.userId, ownerId), eq(userData.revision, parsed.revision)))
      .returning({ revision: userData.revision });
    return saved;
  });
  return result
    ? Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
    : Response.json(
        {
          error:
            'Your cloud data changed in another tab. Export these changes, then reload before importing them.',
        },
        { status: 409 },
      );
}
