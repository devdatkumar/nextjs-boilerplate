"use client";
import Link from "next/link";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SigninForm from "./signin-form";
import OAuthForm from "./oauth-form";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="signin" className="w-96">
        <div className="inline-flex items-center justify-center rounded-lg bg-muted text-muted-foreground w-full">
          <Button variant={"outline"} className="w-1/2 text-foreground h-8">
            Sign in
          </Button>
          <Button asChild variant={"ghost"} className="w-1/2 h-8">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <SigninForm />
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
                <OAuthForm />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
