"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  linkHref?: string;
}

export function Logo({ className = "", linkHref }: LogoProps) {
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative shrink-0 rounded-full">
        <Image
          src="/light-logo.png"
          alt="VelloX Logo"
          width={28}
          height={28}
          className="object-contain rounded-full dark:hidden"
          priority
        />
        <Image
          src="/dark-logo.png"
          alt="VelloX Logo"
          width={28}
          height={28}
          className="object-contain rounded-full hidden dark:block"
          priority
        />
      </div>
      <span className="text-2xl font-medium font-mono ">Vellox</span>

    </div>
  );

  if (linkHref) {
    return <Link href={linkHref}>{logoContent}</Link>;
  }

  return logoContent;
}
