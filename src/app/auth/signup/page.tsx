"use client";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignupForm from "@/components/form/signup";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="signup" className="w-[400px]">
        <div className="inline-flex items-center justify-center rounded-lg bg-muted text-muted-foreground w-full">
          <Button asChild variant={"ghost"} className="w-1/2 h-8">
            <Link href="/auth/signin">Sign in</Link>
          </Button>
          <Button variant={"outline"} className="w-1/2 text-foreground h-8">
            Sign up
          </Button>
        </div>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
