import { db } from "@/db";
import { verificationTokens } from "@/db/schema/verificationtokens";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function generateToken(email: string) {
  const TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
  const token = crypto.randomUUID();
  const hashedToken = await bcrypt.hash(token, 12);
  const expires = new Date(Date.now() + TOKEN_EXPIRY);

  try {
    await db.transaction(async (tx) => {
      // Delete the old token if it exists
      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, email));

      // Insert the new token
      await tx.insert(verificationTokens).values({
        identifier: email,
        token: hashedToken,
        expires,
      });
    });
    return token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Failed to generate verification token: ${error.message}`,
      );
    } else {
      throw new Error(
        "Failed to generate verification token due to an unknown error.",
      );
    }
  }
}
