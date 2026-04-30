import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Logo } from "../Logo";
import { ThemeToggle } from "../theme-toggole";
import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";


export const Navbar = async () => {
  const { isAuthenticated } = getKindeServerSession();
  const isLogin = await isAuthenticated();

  return (
    <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        
        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Logo linkHref="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu isLogin={isLogin ?? false} />
          </div>
        </div>

        {/* Desktop Navbar */}
        <DesktopMenu isLogin={isLogin ?? false} />
        
      </div>
    </nav>
  );
};
