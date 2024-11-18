import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NUXT_POSTGRE_SQL_URL ?? 'postgres://test:test@db.my:5432/test'
  }
});