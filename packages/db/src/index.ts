import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://elevateflow:elevateflow_dev@localhost:5432/elevateflow";

/**
 * PostgreSQL connection via postgres.js.
 *
 * For queries: uses a connection pool (default max 10).
 * For migrations: Drizzle Kit handles its own connection.
 */
const client = postgres(connectionString);

/**
 * Drizzle ORM instance with full schema awareness.
 * Exported for use in API routes and services.
 */
export const db = drizzle(client, { schema });

export type Database = typeof db;

// Re-export schema for convenience
export * from "./schema/index";
