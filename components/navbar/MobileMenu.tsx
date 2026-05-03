import Link from "next/link";
import { Menu, LogOut, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Logo } from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { AuthUser } from "./DesktopMenu";

interface MobileMenuProps {
  isLogin: boolean;
  user: AuthUser;
}

export function MobileMenu({ isLogin, user }: MobileMenuProps) {
  const fallbackText = user?.given_name?.[0] || user?.email?.[0] || "U";

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

          <div className="flex flex-col gap-2 px-2 mt-4">
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
          
          <div className="mt-auto px-6 pb-8 border-t border-border pt-6">
            {!isLogin ? (
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full">
                  <LoginLink>Sign In</LoginLink>
                </Button>
                <Button asChild className="w-full">
                  <RegisterLink>Get Started</RegisterLink>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.picture || ""} alt={user?.given_name || "User avatar"} />
                    <AvatarFallback className="bg-primary/10 text-primary">{fallbackText}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    {user?.given_name && <p className="font-medium text-sm">{user.given_name} {user.family_name}</p>}
                    {user?.email && <p className="w-[180px] truncate text-xs text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                
                <Button asChild className="w-full justify-start" variant="secondary">
                  <Link href="/workspace">
                    <User className="mr-2 h-4 w-4" />
                    Workspace
                  </Link>
                </Button>

                <Button asChild className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50" variant="ghost">
                  <LogoutLink>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </LogoutLink>
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
