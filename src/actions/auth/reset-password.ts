"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, verificationTokens } from "@/db/schema";
import { resetPasswordSchema } from "@/lib/types/auth-schema";

type Payload = {
  formData: FormData;
  email: string;
  token: string;
};

export async function resetPasswordAction(
  _prevState: unknown,
  payload: Payload,
) {
  // Validate data
  const { formData, email, token } = payload;
  const validationResult = resetPasswordSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validationResult.success) {
    return {
      error: "Invalid data type!",
    };
  }

  const { password } = validationResult.data;

  if (!email || !token || !password) {
    return { error: "Email, token, and password must be provided." };
  }

  try {
    // Check if the token exists
    const [tokenRecord] = await db
      .select()
      .from(verificationTokens)
      .where(eq(verificationTokens.identifier, email))
      .limit(1);

    if (!tokenRecord)
      throw new Error("Invalid token. Please request a new one.");

    // Compare token hash
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

    // Hash and update password, then delete token.
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, identifier));

      await tx
        .delete(verificationTokens)
        .where(eq(verificationTokens.identifier, email));
    });

    return { success: "Password changed successfully." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}
