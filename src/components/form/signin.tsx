"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleAlert,
  Eye,
  EyeClosed,
  LoaderPinwheel,
  LogIn,
  UserRoundCheck,
} from "lucide-react";
import { signinAction, oauthAction } from "@/actions/auth/signin";
import { signinSchema } from "@/lib/types/auth";

type FieldError = {
  email?: string[] | undefined;
  password?: string[] | undefined;
};

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState<FieldError | undefined>({});
  const [state, dispatch, isPending] = useActionState(signinAction, undefined);

  const handleAction = (formData: FormData) => {
    const validationResult = signinSchema.safeParse(
      Object.fromEntries(formData)
    );

    if (!validationResult.success) {
      setError(validationResult.error.flatten().fieldErrors);
      setUser({
        email: formData.get("email")?.toString() ?? "",
        password: formData.get("password")?.toString() ?? "",
      });
      return;
    }

    setError({});
    dispatch(formData);
    setUser({ email: "", password: "" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Form action={handleAction}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  defaultValue={user.email}
                  disabled={isPending}
                  required
                />
                {error?.email && (
                  <ul className="text-red-500 text-sm">
                    {error.email.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                )}
              </div>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
                <div className="flex">
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
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm p-1 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              {state?.error && (
                <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500 border">
                  <CircleAlert />
                  <p>{state.error}</p>
                </div>
              )}
              {state?.success && (
                <div className="bg-green-500/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-500 border">
                  <UserRoundCheck />
                  <p>{state.success}</p>
                </div>
              )}
              <Button type="submit" disabled={isPending}>
                {isPending && <LoaderPinwheel className="animate-spin" />}
                <LogIn />
                Sign in
              </Button>
            </div>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Form action={oauthAction} className="flex flex-col gap-4">
            <Button type="submit" name="authProvider" value="apple">
              Apple
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={16}
                height={16}
                className="invert dark:invert-0"
              >
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
            </Button>
            <div className="flex gap-4">
              <Button
                type="submit"
                name="authProvider"
                value="google"
                className="grow"
              >
                Google
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                >
                  <path
                    fill="#EA4335"
                    d="M5.27 9.76A7.08 7.08 0 0 1 16.42 6.5L19.9 3A11.97 11.97 0 0 0 1.24 6.65l4.03 3.11Z"
                  />
                  <path
                    fill="#34A853"
                    d="M16.04 18.01A7.4 7.4 0 0 1 12 19.1a7.08 7.08 0 0 1-6.72-4.82l-4.04 3.06A11.96 11.96 0 0 0 12 24a11.4 11.4 0 0 0 7.83-3l-3.79-2.99Z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M19.83 21c2.2-2.05 3.62-5.1 3.62-9 0-.7-.1-1.47-.27-2.18H12v4.63h6.44a5.4 5.4 0 0 1-2.4 3.56l3.8 2.99Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27a7.12 7.12 0 0 1-.01-4.5L1.24 6.64A11.93 11.93 0 0 0 0 12c0 1.92.44 3.73 1.24 5.33l4.04-3.06Z"
                  />
                </svg>
              </Button>
              <Button type="submit" name="authProvider" value="github">
                Github
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  className="invert dark:invert-0"
                >
                  <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57L9 21.07c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
                </svg>
              </Button>
            </div>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
