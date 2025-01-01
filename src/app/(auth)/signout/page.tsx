import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { signOut } from "@/auth";

export default async function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Out</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <Button type="submit" className="w-full">
              Sign Out
              <LogOut className="ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
