"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForgotPasswordForm from "./forgot-password-form";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <hr className="my-4" />
          <Button asChild variant={"outline"}>
            <Link href={"/signin"}>
              <ArrowLeft size={20} />
              Sign in
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
