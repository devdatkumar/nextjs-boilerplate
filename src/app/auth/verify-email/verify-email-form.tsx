"use client";

import React, { useActionState } from "react";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { CircleAlert, LoaderPinwheel, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/actions/auth/verify-email";

export default function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const [state, dispatch, isPending] = useActionState(
    verifyEmailAction,
    undefined
  );

  const handleAction = () => {
    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";

    dispatch({ email, token });
  };

  return (
    <Form action={handleAction}>
      <div className="grid gap-4 w-full">
        <Button type="submit" disabled={isPending}>
          {isPending && <LoaderPinwheel className="animate-spin" />}
          <LogIn />
          Verify email
        </Button>
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
      </div>
    </Form>
  );
}
