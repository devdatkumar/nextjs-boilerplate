"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { generateToken } from "@/lib/auth/generate-token";
import { mailResetPasswordToken } from "@/lib/auth/mail-reset-password-token";
import { forgotPasswordSchema } from "@/lib/types/auth";

export async function forgotPasswordAction(
  _prevState: unknown,
  formData: FormData,
) {
  // Validate data
  const validationResult = forgotPasswordSchema.safeParse(
    Object.fromEntries(formData),
  );

  if (!validationResult.success) {
    return {
      error: "Invalid Email!",
      data: { email: formData.get("email")?.toString() ?? "" },
    };
  }

  try {
    // Check existing user
    const { email } = validationResult.data;
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new Error("User not found.");
    }

    // Generate and mail the token
    const resetToken = await generateToken(user.email);
    const emailSent = await mailResetPasswordToken(
      user.name,
      user.email,
      resetToken,
    );

    if (!emailSent) {
      throw new Error("Failed to send email.");
    }

    return { success: "Please check your email to reset password." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}
