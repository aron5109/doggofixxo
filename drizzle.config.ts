import { defineConfig } from 'drizzle-kit';
import { getMigrationCredentials } from './lib/database-config';
export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: getMigrationCredentials(),
});
