"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CircleAlert, LoaderPinwheel, LogIn } from "lucide-react";
import { verifyEmailAction } from "@/actions/auth/verify-email";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [state, dispatch, isPending] = useActionState(
    verifyEmailAction,
    undefined,
  );

  const handleAction = () => {
    const email = searchParams.get("email") ?? "";
    const token = searchParams.get("token") ?? "";

    dispatch({ email, token });
  };

  return (
    <Card className="w-[400]">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Email</CardTitle>
      </CardHeader>
      <CardContent>
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
        <hr className="my-4" />
        <Button asChild variant={"outline"}>
          <Link href={"/auth/signin"}>
            <ArrowLeft size={20} />
            Sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
