"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { signupSchema } from "@/lib/types/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { generateToken } from "@/lib/auth/generate-token";
import { mailVerifyEmailToken } from "@/lib/auth/mail-verify-email-token";

export async function signupAction(_prevState: unknown, formData: FormData) {
  // validate data
  const validationResult = signupSchema.safeParse(Object.fromEntries(formData));
  if (!validationResult.success) {
    return {
      error: "Invalid data type!",
    };
  }

  const { name, email, password } = validationResult.data;

  try {
    // Check existing user
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new Error("User already exists!");
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        name: name,
        email: email,
        password: hashedPassword,
      })
      .returning({ email: users.email, name: users.name });

    if (!newUser) {
      throw new Error("Failed to create user.");
    }

    // Generate and mail emailVerified token
    const verificationToken = await generateToken(newUser.email);
    const emailSent = await mailVerifyEmailToken(
      newUser.name,
      newUser.email,
      verificationToken,
    );

    if (!emailSent) {
      throw new Error("Failed to send verification email.");
    }

    return { success: "Please check your email to verify." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }
}
