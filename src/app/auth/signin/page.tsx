"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SigninForm from "@/components/form/signin";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="signin" className="w-[400px]">
        <div className="inline-flex items-center justify-center rounded-lg bg-muted text-muted-foreground w-full">
          <Button variant={"outline"} className="w-1/2 text-foreground h-8">
            Sign in
          </Button>
          <Button asChild variant={"ghost"} className="w-1/2 h-8">
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </div>
        <TabsContent value="signin">
          <SigninForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
