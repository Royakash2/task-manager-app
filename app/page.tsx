import { Button } from "@/components/ui/button";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";


export default function Home() {
  return (
    <div className="w-full h-screen flex space-y-6 flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">well come to XM8</h1>
      <div className="flex  gap-2">
        <Button className="p-5">
          <RegisterLink>Sign Up</RegisterLink>
        </Button>
        <Button variant="outline" className="p-5">
          <LoginLink>Log In</LoginLink>
        </Button>
      </div>
    </div>
  );
}
