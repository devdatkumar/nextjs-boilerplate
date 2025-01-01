"use client";

import React, { useActionState } from "react";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CircleAlert,
  LoaderPinwheel,
  LogIn,
  UserRoundCheck,
} from "lucide-react";
import { forgotPasswordAction } from "@/actions/auth/forgot-password";

export default function ForgotPasswordForm() {
  const [state, dispatch, isPending] = useActionState(
    forgotPasswordAction,
    undefined,
  );

  return (
    <Form action={dispatch}>
      <div className="grid gap-4 w-[400]">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            defaultValue={state?.data?.email ?? ""}
            disabled={isPending}
            required
          />
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
          Request
        </Button>
      </div>
    </Form>
  );
}
