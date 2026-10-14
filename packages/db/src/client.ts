import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';
import path from 'path';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    const raw = process.env.DATABASE_URL;
    if (
      raw.startsWith('libsql:') ||
      raw.startsWith('http:') ||
      raw.startsWith('https:')
    ) {
      return raw;
    }
    const clean = raw.replace(/^file:/, '');
    const absPath = path.isAbsolute(clean)
      ? clean
      : path.resolve(process.cwd(), clean);
    return `file:${absPath.replace(/\\/g, '/')}`;
  }

  // Default path in packages/db
  return 'file:C:/itc/packages/db/data.db';
}

const url = getDatabaseUrl();

export const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
