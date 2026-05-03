import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { ThemeToggle } from "../theme-toggole";
import { Logo } from "../Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export type AuthUser = {
  id?: string;
  email: string | null;
  given_name: string | null;
  family_name: string | null;
  picture: string | null;
} | null;

interface DesktopMenuProps {
  isLogin: boolean;
  user: AuthUser;
}

export const DesktopMenu = ({ isLogin, user }: DesktopMenuProps) => {
  const fallbackText = user?.given_name?.[0] || user?.email?.[0] || "U";

  return (
    <div className="hidden md:flex items-center justify-between w-full">
      <div className="flex items-center gap-8">
        <Logo linkHref="/" />
        <div className="flex items-center gap-6 font-medium text-base text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors ">Features</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {isLogin ? (
          <div className="flex items-center gap-4">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.picture || ""} alt={user?.given_name || "User avatar"} />
                    <AvatarFallback className="bg-primary/10 text-primary">{fallbackText}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.given_name && <p className="font-medium">{user.given_name} {user.family_name}</p>}
                    {user?.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/workspace" className="cursor-pointer w-full flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Workspace</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/50">
                  <LogoutLink className="cursor-pointer w-full flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
