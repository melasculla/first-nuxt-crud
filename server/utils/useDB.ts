import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg
export const connection = new Pool({
  connectionString: process.env.NUXT_POSTGRE_SQL_URL!
});

export const db = drizzle(connection)