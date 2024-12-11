import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SigninForm from "./ui/signin-form";
import SignupForm from "./ui/signup-form";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SigninForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
