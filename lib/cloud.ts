export const cloudConfigured = Boolean(
  process.env.DATABASE_URL &&
  process.env.AUTH_SECRET &&
  process.env.AUTH_GOOGLE_ID &&
  process.env.AUTH_GOOGLE_SECRET,
);
export function requireOwner(id: string | null | undefined): string {
  if (!id) throw new Error('Authentication required');
  return id;
}
