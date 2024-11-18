import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from '../db/schema';
import pkg from "pg";

const { Pool } = pkg
export const connection = new Pool({
  connectionString: process.env.NUXT_POSTGRE_SQL_URL ?? 'postgres://test:test@db.my:5432/test'
});

export const db = drizzle(connection, { schema })