import { Button } from "@/components/ui/button";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";


export default async function Home() {
  const {isAuthenticated } = getKindeServerSession();
  const isLogin = await isAuthenticated();

  return (
    <div className="w-full h-screen flex space-y-6 flex-col justify-center items-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-6xl font-bold tracking-tight">
            your personal workspace <br /> 
            <span className="text-blue-600">Aura</span> for better productivity
          </h1>
          <p className="lg:text-lg mt-6 max-w-2xl text-muted-foreground mx-auto text-base">
            Aura is a premium task management platform designed to bring clarity and speed to your workflow.
          </p>
        </div>
        <div className="flex justify-center items-center mt-6 gap-4">
          
            {isLogin ? (
              <>
              <Button asChild>
                <Link href="/workspace">
                  Goto Workspace
                </Link>
              </Button>
              </>
              
           ) : (
            <>
            <Button>
                <RegisterLink>
                 Get Started
                </RegisterLink>
              </Button>
            <Button asChild variant="outline" >
              <LoginLink>
                Sign In
              </LoginLink>
            </Button>
            </>
           )}
          
        </div>
      </div>
    </div>
  );
}
