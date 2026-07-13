import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Logo } from "../../Logo";
import { ThemeToggle } from "../../theme-toggle";
import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";

export const Navbar = async () => {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isLogin = await isAuthenticated();
  const user = isLogin ? await getUser() : null;

  return (
    <nav className="w-full border-b border-border/40 bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        
        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Logo linkHref="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu isLogin={isLogin ?? false} user={user} />
          </div>
        </div>

        {/* Desktop Navbar */}
        <DesktopMenu isLogin={isLogin ?? false} user={user} />
        
      </div>
    </nav>
  );
};
