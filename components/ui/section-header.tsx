import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  badge?: string;
  highlight?: string;
  description?: string;
  children?: ReactNode;
  size?: "sm" | "default" | "lg";
}

export function SectionHeader({
  title,
  badge,
  highlight,
  description,
  size = "default",
}: SectionHeaderProps) {
  
  const sizeClasses = {
    sm: "text-3xl sm:text-4xl md:text-5xl",
    default: "text-4xl sm:text-5xl md:text-6xl",
    lg: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
  };

  return (
    <div className="mb-16 md:mb-24 flex flex-col items-start text-left max-w-3xl">
      {badge && (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-primary font-mono text-sm tracking-widest font-semibold uppercase">
            / {badge}
          </span>
        </div>
      )}
      <h2 className={`${sizeClasses[size]} font-medium tracking-tight text-foreground leading-[1.1]`}>
        {title}{" "}
        {highlight && (
          <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed font-light">
          {description}
        </p>
      )}
    </div>
  );
}
