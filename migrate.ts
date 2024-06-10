import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { connection, db } from './server/utils/useDB';

await migrate(db, { migrationsFolder: './migrations' })

await connection.end()