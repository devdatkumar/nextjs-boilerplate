import { z } from "zod";

const name = z
  .string()
  .min(4, "At least 4 characters.")
  .max(64, "Up to 64 characters.");

const email = z.string().email("Invalid email address.").trim().toLowerCase();

const password = z
  .string()
  .min(8, "8 characters.")
  .regex(/\d/, "a number.")
  .regex(/[A-Z]/, "an uppercase letter.")
  .regex(/[a-z]/, "a lowercase letter.")
  .regex(/[@$!%*?&#]/, "a special character.")
  .max(64, "Up to 64 characters.");

export const signinSchema = z.object({ email, password });

export const signupSchema = z.object({ name, email, password });

export const forgotPasswordSchema = z.object({ email });
export const resetPasswordSchema = z.object({ password });
