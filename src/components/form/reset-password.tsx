"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Eye,
  EyeClosed,
  LoaderPinwheel,
  LogIn,
} from "lucide-react";
import { resetPasswordAction } from "@/actions/auth/reset-password";
import { resetPasswordSchema } from "@/lib/types/auth";
import { useSearchParams } from "next/navigation";

type FieldError = {
  password?: string[] | undefined;
};

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ password: "" });
  const [error, setError] = useState<FieldError | undefined>({});
  const [state, dispatch, isPending] = useActionState(
    resetPasswordAction,
    undefined,
  );

  const handleAction = (formData: FormData) => {
    const validationResult = resetPasswordSchema.safeParse(
      Object.fromEntries(formData),
    );

    if (!validationResult.success) {
      setError(validationResult.error.flatten().fieldErrors);
      setUser({
        password: formData.get("password")?.toString() ?? "",
      });
      return;
    }

    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";

    setError({});
    dispatch({ formData, email, token });
    setUser({ password: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form action={handleAction}>
          <div className="grid gap-4 w-[400]">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-x-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  autoComplete="current-password"
                  defaultValue={user.password}
                  disabled={isPending}
                  required
                />
                <Button
                  className="rounded-xl"
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
              {error?.password && (
                <ol className="text-red-500 text-sm">
                  Password must contain:
                  {error.password.map((error, index) => (
                    <li key={index} className="pl-2">
                      - {error}
                    </li>
                  ))}
                </ol>
              )}
            </div>
            {state?.error && (
              <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500 border">
                <CircleAlert />
                <p>{state.error}</p>
              </div>
            )}
            {state?.success && (
              <div className="bg-green-500/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-500 border">
                <CircleAlert />
                <p>{state.success}</p>
              </div>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending && <LoaderPinwheel className="animate-spin" />}
              <LogIn />
              Reset Password
            </Button>
          </div>
        </Form>
        <hr className="my-4" />
        <div className="flex justify-between">
          <Button asChild variant={"outline"}>
            <Link href={"/auth/forgot-password"}>
              <ArrowLeft size={20} />
              Forgot password
            </Link>
          </Button>
          <Button asChild variant={"outline"}>
            <Link href={"/auth/signin"}>
              Sign in
              <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
