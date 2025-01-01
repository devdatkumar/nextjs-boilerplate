"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";
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
import { signinAction } from "@/actions/auth/signin";
import { signinSchema } from "@/lib/types/auth-schema";

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
      Object.fromEntries(formData),
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
              aria-label={showPassword ? "Hide password" : "Show password"}
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
              href="/forgot-password"
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
  );
}
