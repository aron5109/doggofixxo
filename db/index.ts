import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getDatabaseConnection } from '../lib/database-config';
const connection = getDatabaseConnection();
export const db = connection
  ? drizzle(postgres(connection.url, { prepare: false, max: 3, ssl: connection.ssl }), { schema })
  : null;
