import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-16 md:gap-8">
          
          {/* Left Side: Brand & Logo */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/dark-logo.png"
                alt="VelloX Logo"
                width={32}
                height={32}
                className="object-contain rounded-full"
              />
              <span className="text-2xl font-medium font-mono text-white">Vellox</span>
            </Link>
            <p className="text-zinc-400 text-sm sm:text-base">
              The ultimate workspace. Stop managing. Start building.
            </p>
            <p className="text-xs text-zinc-400 mt-2">
              © VelloX, Inc {new Date().getFullYear()}
            </p>
          </div>

          {/* Right Side: Links */}
          <div className="flex flex-wrap gap-16 sm:gap-24">
            {/* Quick Links Column */}
            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-sm tracking-widest text-white uppercase">
                Quick Links
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#product-showcase" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div className="flex flex-col gap-6">
              <h3 className="font-mono text-sm tracking-widest text-white uppercase">
                Follow Us
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="https://x.com/akash_coding" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="https://www.linkedin.com/in/akash-roy-0b28442b2/" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/Royakash2/task-manager-app" target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

