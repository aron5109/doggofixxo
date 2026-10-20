import { getDatabaseConnection } from './database-config';
export function hasCloudConfiguration(
  environment: Record<string, string | undefined> = process.env,
) {
  return Boolean(
    getDatabaseConnection(environment) &&
    environment.AUTH_SECRET &&
    environment.AUTH_GOOGLE_ID &&
    environment.AUTH_GOOGLE_SECRET,
  );
}
export const cloudConfigured = hasCloudConfiguration();
export function requireOwner(id: string | null | undefined): string {
  if (!id) throw new Error('Authentication required');
  return id;
}
