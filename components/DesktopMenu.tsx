import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Logo } from "./Logo";
import { ThemeToggle } from "./theme-toggole";

export const DesktopMenu = ({ isLogin }: { isLogin: boolean }) => {
  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <div className="flex items-center gap-8">
        <Logo linkHref="/" />
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isLogin ? (
          <Button asChild size="sm">
            <Link href="/workspace">Go to Workspace</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <LoginLink>Sign In</LoginLink>
            </Button>
            <Button asChild size="sm">
              <RegisterLink>Get Started</RegisterLink>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
