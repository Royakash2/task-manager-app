import Link from "next/link";

type NavLinksVariant = "desktop" | "mobile";

interface NavLinksProps {
  variant: NavLinksVariant;
}

const navItems = [
  { label: "How It Works", href: "#product-showcase" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

const desktopStyles = {
  container: "flex items-center gap-10 font-semibold text-sm text-muted-foreground",
  link: "hover:text-foreground transition-colors uppercase",
};

const mobileStyles = {
  container: "flex flex-col gap-2 px-2",
  link: "px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-all uppercase",
};

export const NavLinks = ({ variant }: NavLinksProps) => {
  const styles = variant === "desktop" ? desktopStyles : mobileStyles;

  return (
    <div className={styles.container}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className={styles.link}>
          {item.label}
        </Link>
      ))}
    </div>
  );
};
