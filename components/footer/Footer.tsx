import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="w-full bg-background pt-16 pb-8">
      <Separator className="bg-border/40 mb-16" />
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Column 1: Logo & Info */}
          <div className="md:col-span-1">
            <div className="mb-5">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              VelloX is a premium task management platform designed to bring clarity and speed to your workflow.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-5">Product</h3>
            <ul className="space-y-3.5">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-5">Company</h3>
            <ul className="space-y-3.5">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-5">Legal</h3>
            <ul className="space-y-3.5">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <Separator className="bg-border/40" />
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} VelloX. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            Built with <span className="text-red-500 animate-pulse">♥</span> for teams
          </div>
        </div>
      </div>
    </footer>
  );
};

