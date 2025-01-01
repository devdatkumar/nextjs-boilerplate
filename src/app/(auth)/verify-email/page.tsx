"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VerifyEmailForm from "./verify-email-form";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-[400]">
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm />
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
