
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  linkHref?: string;
}

export function Logo({ className = "", linkHref }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
        <Image
          src="/Logo.png"
          alt="AlignerHQ Logo"
          fill
          className="object-center"
        />
      </div> */}
      <span className="text-3xl font-bold tracking-tight font-mono">VelloX</span>
    </div>
  );

  if (linkHref) {
    return <Link href={linkHref}>{logoContent}</Link>;
  }

  return logoContent;
}
