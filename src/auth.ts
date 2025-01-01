import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import authConfig from "./auth.config";
import { db } from "@/db/index";
import * as schema from "@/db/schema";

const adapterSchema = {
  usersTable: schema.users,
  accountsTable: schema.accounts,
  sessionsTable: schema.sessions,
  verificationTokensTable: schema.verificationTokens,
  authenticatorsTable: schema.authenticators,
};

export const config = {
  adapter: DrizzleAdapter(db, adapterSchema) as Adapter,
  ...authConfig,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
