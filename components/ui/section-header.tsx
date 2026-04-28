import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  highlight?: string;
  description: string;
  children?: ReactNode;
}

export function SectionHeader({
  title,
  highlight,
  description,
}: SectionHeaderProps) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground/90 mb-5">
        {title}{" "}
        {highlight && (
          <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h2>
      <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
}
