import { getDatabaseConnection } from './database-config';
export function getCloudConfigurationStatus(
  environment: Record<string, string | undefined> = process.env,
) {
  const missing: string[] = [];
  const invalid: string[] = [];
  try {
    if (!getDatabaseConnection(environment)) missing.push('POSTGRES_URL (or DATABASE_URL)');
  } catch {
    invalid.push('POSTGRES_URL (or DATABASE_URL)');
  }
  for (const name of ['AUTH_SECRET', 'AUTH_GOOGLE_ID', 'AUTH_GOOGLE_SECRET']) {
    if (!environment[name]?.trim()) missing.push(name);
  }
  return { configured: missing.length === 0 && invalid.length === 0, missing, invalid };
}
export function hasCloudConfiguration(
  environment: Record<string, string | undefined> = process.env,
) {
  return getCloudConfigurationStatus(environment).configured;
}
export const cloudConfigured = hasCloudConfiguration();
export function requireOwner(id: string | null | undefined): string {
  if (!id) throw new Error('Authentication required');
  return id;
}
