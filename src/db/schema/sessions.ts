import { timestamp, pgTable, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});
