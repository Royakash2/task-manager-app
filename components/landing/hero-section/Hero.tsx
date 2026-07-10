import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TrustedByLogos } from "./TrustedByLogos";

export const Hero = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLogin = await isAuthenticated();

  return (
    <section className="relative w-full pt-24 pb-16 md:pt-40 md:pb-24 flex flex-col items-center overflow-hidden">

      <div className="w-full max-w-7xl mx-auto relative z-10 px-4 md:px-6 flex flex-col items-center">
        <div className="text-center flex flex-col items-center w-full max-w-4xl">
          
          {/* Heading */}
          <h1 className="text-[3.5rem] leading-[1.1] sm:text-7xl md:text-8xl font-medium tracking-tight text-foreground flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 md:gap-x-8 w-full">
            <span>Plan</span>
            <span className="text-muted-foreground relative inline-block">
              <span className="absolute top-[52%] left-0 w-full h-[0.08em] bg-muted-foreground/80 -translate-y-1/2"></span>
              chase
            </span>
            <span>execute</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl mt-8 max-w-2xl text-muted-foreground mx-auto leading-relaxed font-light">
            VelloX proactively organizes and clarifies your daily tasks and projects so you can focus on executing them.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex  justify-center items-center mt-12 gap-4 sm:gap-6 w-full">
          {isLogin ? (
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/workspace">
                Goto Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
             <Button asChild variant="outline" size="lg">
                <LoginLink>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </LoginLink>
              </Button>
              <Button size="lg" asChild>
                <RegisterLink>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </RegisterLink>
              </Button>
            </>
          )}
        </div>

        {/* Small text below buttons */}
        <div className="mt-8 text-sm font-mono text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center">
          <span>trusted by fast-growing teams</span>
          <span className="hidden sm:inline">·</span>
          <span>Plan · Track · Ship</span>
        </div>

        <TrustedByLogos />

      </div>
    </section>
  );
};
