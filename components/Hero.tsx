import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";

export const Hero = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLogin = await isAuthenticated();

  return (
    <section className="w-full h-[calc(100vh-64px)] flex space-y-6 flex-col justify-center items-center px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            your personal workspace <br />
            <span className="text-blue-600">VelloX</span> for better productivity
          </h1>
          <p className="lg:text-lg mt-6 max-w-2xl text-muted-foreground mx-auto text-base">
            VelloX is a premium task management platform designed to bring clarity and speed to your workflow.
          </p>
        </div>
        <div className="flex justify-center items-center mt-8 gap-4">
          {isLogin ? (
            <Button asChild size="lg">
              <Link href="/workspace">
                Goto Workspace
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <RegisterLink>
                  Get Started Free
                </RegisterLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <LoginLink>
                  See How It Works
                </LoginLink>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
