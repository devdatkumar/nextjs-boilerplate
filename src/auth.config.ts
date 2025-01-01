// https://authjs.dev/guides/edge-compatibility

import {
  CredentialsSignin,
  type NextAuthConfig,
  type DefaultSession,
} from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { signinSchema } from "@/lib/types/auth-schema";
import { db } from "./db";
import { users } from "./db/schema";

// Define user role type
type UserRole = typeof users.$inferSelect.role;
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
    } & DefaultSession["user"];
  }
  interface User {
    role: string;
  }
}

// Custom error class to handle error messages
class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  providers: [
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        // check and parse credentials
        if (!credentials) {
          throw new CustomError("No credentials provided");
        }

        const parsed = signinSchema.safeParse(credentials);
        if (!parsed.success) {
          throw new CustomError("Invalid credentials format");
        }

        // Retrieve user from database to validate
        const { email, password } = parsed.data;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!user || !user.password) {
          throw new CustomError("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new CustomError("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add role to token
      if (user) {
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id and role to session
      if (session) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.role) {
          session.user.role = token.role as UserRole;
        }
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const DEFAULT_URL = "/";
      const isApiRoute = nextUrl.pathname.startsWith("/api/");
      const isAuthRoute = [
        "/signin",
        "/signup",
        "/verify-email",
        "/forgot-password",
        "/reset-password",
      ].includes(nextUrl.pathname);
      const isPublicRoute = [
        "/",
        "/error",
        "/signout",
        "/about",
        "/contact",
      ].includes(nextUrl.pathname);
      const isAdminRoute = ["/protected"].includes(nextUrl.pathname);

      const isAdmin = auth?.user?.role === "ADMIN";
      const isLoggedIn = !!auth?.user;

      if (isLoggedIn) {
        // If loggedin, redirect to Default_url for auth routes
        if (isAuthRoute) {
          return Response.redirect(new URL(DEFAULT_URL, nextUrl));
        }
        // If loggedin and not admin, redirect to Default_url for admin routes
        if (isAdminRoute && !isAdmin) {
          return Response.redirect(new URL(DEFAULT_URL, nextUrl));
        }
        return true;
      }

      if (isApiRoute || isAuthRoute || isPublicRoute) {
        return true;
      }

      // Redirect to signin page with callbackUrl for protected routes
      const signInUrl = new URL("/signin", nextUrl);
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return Response.redirect(signInUrl);
    },
    async signIn({ user, account }) {
      // Auto update emailVerified for other providers
      if (user.id && account?.provider !== "credentials") {
        // Check existing user
        const [existingUser] = await db
          .select({
            emailVerified: users.emailVerified,
          })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        if (!existingUser?.emailVerified) {
          await db
            .update(users)
            .set({ emailVerified: new Date() })
            .where(eq(users.id, user.id));
          return true;
        }
      }
      return true;
    },
  },
};

export default authConfig;
