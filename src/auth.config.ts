// https://authjs.dev/guides/edge-compatibility
import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";

const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID,
      clientSecret: process.env.AUTH_APPLE_ID,
    }),
  ],
};

export default authConfig;
