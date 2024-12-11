"use client";

import React, { useActionState, useState } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { signinAction, oauthAction } from "@/actions/signinAction";

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch, isPending] = useActionState(signinAction, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Form action={dispatch}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="example@email.com"
                  defaultValue={state?.formData?.get("email")?.toString() ?? ""}
                  disabled={isPending}
                  required
                />
                {state?.fieldError?.email && (
                  <ul className="text-red-500 text-sm">
                    {state.fieldError.email.map((error, index) => (
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
                    defaultValue={
                      state?.formData?.get("password")?.toString() ?? ""
                    }
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
                  {state?.fieldError?.password && (
                    <ol className="text-red-500 text-sm">
                      Password must:
                      {state.fieldError.password.map((error, index) => (
                        <li key={index} className="pl-2">
                          - {error}
                        </li>
                      ))}
                    </ol>
                  )}
                  <Link href="/forgot-password" className="ml-auto text-sm p-1">
                    Forgot password?
                  </Link>
                </div>
              </div>
              {state?.authError && (
                <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500 border">
                  <CircleAlert />
                  <p>{state.authError}</p>
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
              <Image
                src="/Apple.svg"
                alt="Apple Logo"
                width={16}
                height={16}
                className="invert dark:invert-0"
              />
            </Button>
            <div className="flex gap-4">
              <Button
                type="submit"
                name="authProvider"
                value="google"
                className="grow"
              >
                Google
                <Image
                  src="/Google.svg"
                  alt="Google Logo"
                  width={16}
                  height={16}
                />
              </Button>
              <Button type="submit" name="authProvider" value="github">
                Github
                <Image
                  src="/Github.svg"
                  alt="Github Logo"
                  width={16}
                  height={16}
                  className="invert dark:invert-0"
                />
              </Button>
            </div>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
