"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verificationTokens } from "@/db/schema/verificationtokens";

type Payload = {
  email: string;
  token: string;
};

export async function verifyEmailAction(_prevState: unknown, payload: Payload) {
  const { email, token } = payload;
  if (!email || !token) {
    return { error: "Email and token must be provided." };
  }

  try {
    // Check if the email is already verified
    const [user] = await db
      .select({ verified: users.emailVerified })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) throw new Error("User not found!");
    if (user.verified) throw new Error("Email already verified");

    // Check if the token exists
    const [tokenRecord] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .limit(1);

    if (!tokenRecord)
      throw new Error("Invalid token. Please request a new one.");

    const isTokenValid = await bcrypt.compare(token, tokenRecord.token);
    if (!isTokenValid) {
      throw new Error("Invalid token. Please request a new one.");
    }

    // Check if the token has expired
    const { identifier, expires } = tokenRecord;
    if (new Date() > expires) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, email));

      throw new Error("Token expired. Please request a new one.");
    }

    // Verify email and delete token
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.email, identifier));

      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, email));
    });

    return { success: "Email verified" };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}
