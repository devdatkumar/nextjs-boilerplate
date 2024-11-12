import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables");
}

const client = postgres(connectionString, {
  max: 1,
  prepare: false,
  ssl: process.env.NODE_ENV === "production" ? "prefer" : false,
});

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});

export const closeDbConnection = () => {
  client.end();
};
