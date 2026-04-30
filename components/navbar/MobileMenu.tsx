import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Logo } from "../Logo";


interface MobileMenuProps {
  isLogin: boolean;
}

export function MobileMenu({ isLogin }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="flex flex-col w-[300px]">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          
          <div className="pt-6 pb-2 px-6">
            <Logo linkHref="/" />
          </div>

          <div className="flex flex-col gap-2 px-2">
            <Link href="#features" className="px-4 py-3 text-base font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
              Features
            </Link>
            <Link href="#pricing" className="px-4 py-3 text-base font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
              Pricing
            </Link>
            <Link href="#about" className="px-4 py-3 text-base font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all">
              About
            </Link>
          </div>
          
          <div className="flex flex-col gap-3 mt-4 px-6 pt-6 border-t border-border">
            {!isLogin ? (
              <>
                <Button asChild variant="outline" className="w-full">
                  <LoginLink>Sign In</LoginLink>
                </Button>
                <Button asChild className="w-full">
                  <RegisterLink>Get Started</RegisterLink>
                </Button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link href="/workspace">Go to Workspace</Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
