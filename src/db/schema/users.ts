import { timestamp, pgTable, text, boolean, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password"),
    image: text("image"),
    role: text("role").$type<"ADMIN" | "USER">().notNull().default("USER"),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
    softDelete: timestamp("deleted_at", { mode: "date" }),
    isDisabled: boolean("is_disabled").default(false),
  },
  (user) => [
    index("email_idx").on(user.email),
    index("role_idx").on(user.role),
  ],
);
