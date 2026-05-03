import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/ui/animated-background";

export const Hero = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLogin = await isAuthenticated();

  return (
    <section className="relative w-full pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center px-4 overflow-hidden">


      <div className="max-w-7xl mx-auto relative z-10">
        {/* Animated Particle Network Background */}
        <AnimatedBackground />

        <div className="text-center">

          {/* Announcement Pill Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center rounded-md border border-blue-200/50 bg-blue-50/50 px-3 py-1 text-sm text-blue-600 backdrop-blur-sm dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              Introducing VelloX for Teams
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground/90 mb-4">
            Your personal workspace <br className="hidden sm:block" />
            <span className="font-mono bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              VelloX
            </span> for better productivity
          </h1>

          <p className="text-base sm:text-lg mt-4 sm:mt-6 max-w-2xl text-muted-foreground mx-auto">
            VelloX is a premium task management platform designed to bring clarity and speed to your workflow. Stop managing tasks, start executing them.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center mt-8 sm:mt-10 gap-3 sm:gap-4 w-full px-2 sm:px-0">
          {isLogin ? (
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/workspace">
                Goto Workspace <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild className="w-full sm:w-auto">
                <RegisterLink>
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </RegisterLink>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <LoginLink>
                  See How It Works
                </LoginLink>
              </Button>
            </>
          )}
        </div>

        {/* Dashboard Showcase Image */}
        <div className="mt-16 sm:mt-24 w-full max-w-5xl mx-auto relative rounded-xl sm:rounded-2xl border border-border/50 shadow-2xl shadow-blue-900/5 overflow-hidden">

          <Image
            src="/dashboard-hero.png"
            alt="VelloX Dashboard Preview"
            width={1200}
            height={800}
            className="w-full h-auto object-cover rounded-xl sm:rounded-2xl transform hover:scale-[1.01] transition-transform duration-700 ease-out"
            priority
          />
        </div>
      </div>
    </section>
  );
};
