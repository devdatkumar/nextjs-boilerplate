"use client";

import React, { useActionState, useState } from "react";
import Form from "next/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleAlert,
  Eye,
  EyeClosed,
  LoaderPinwheel,
  LogIn,
} from "lucide-react";
import { signupAction } from "@/actions/signupAction";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch, isPending] = useActionState(signupAction, undefined);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <Form action={dispatch}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Full Name"
                defaultValue={state?.formData?.get("name")?.toString() ?? ""}
                disabled={isPending}
                required
              />
              {state?.fieldError?.name && (
                <ul className="text-red-500 text-sm">
                  {state.fieldError.name.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
            </div>
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </Button>
              </div>
              <div>
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
              Sign up
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
