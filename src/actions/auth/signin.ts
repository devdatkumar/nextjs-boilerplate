"use server";

import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { signinSchema } from "@/lib/types/auth";
import { generateToken } from "@/lib/auth/generate-token";
import { mailVerifyEmailToken } from "@/lib/auth/mail-verify-email-token";
import { signIn } from "@/auth";

export async function signinAction(_prevState: unknown, formData: FormData) {
  // Validate data
  const validationResult = signinSchema.safeParse(Object.fromEntries(formData));
  if (!validationResult.success) {
    return {
      error: "Invalid data type!",
    };
  }

  const { email, password } = validationResult.data;

  // Retrieve user data from existing user
  try {
    const [user] = await db
      .select({
        name: users.name,
        email: users.email,
        password: users.password,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.email, email));

    if (!user || !user.password) {
      throw new Error("User not found!");
    }

    // validate credentials
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentails!");
    }

    // If not verified, generate token and send email verification
    if (!user.emailVerified) {
      const verificationToken = await generateToken(user.email);
      const emailSent = await mailVerifyEmailToken(
        user.name,
        user.email,
        verificationToken,
      );

      if (!emailSent) {
        throw new Error("Failed to send verification email.");
      }
      return { success: "Please check your email to verify." };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Something went wrong!",
    };
  }

  // call signIn credentails provider function.
  return await signInCredentails(email, password);
}

const signInCredentails = async (email: string, password: string) => {
  // Call signIn with credentails provider
  try {
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "AccessDenied":
          return { error: error.message ?? "Access denied!" };
        case "CredentialsSignin":
          return { error: error.message ?? "Invalid credentials!" };
        case "Verification":
          return { error: error.message ?? "Verification failed!" };
        default:
          return {
            error: error.message ?? "Authentication error.",
          };
      }
    }
    throw error;
  }
};

// OAuth Provider Action
export async function oauthAction(formData: FormData) {
  const authProvider = formData.get("authProvider")?.toString();
  await signIn(authProvider, { redirectTo: "/" });
}
