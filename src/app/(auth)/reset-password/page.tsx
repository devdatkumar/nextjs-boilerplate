"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import ResetPasswordForm from "./reset-password-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
          <hr className="my-4" />
          <div className="flex justify-between">
            <Button asChild variant={"outline"}>
              <Link href={"/forgot-password"}>
                <ArrowLeft size={20} />
                Forgot password
              </Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href={"/signin"}>
                Sign in
                <ArrowRight size={20} />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
