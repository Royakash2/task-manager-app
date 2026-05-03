import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  title: string;
  badge?: string;
  highlight?: string;
  description: string;
  children?: ReactNode;
}

export function SectionHeader({
  title,
  badge,
  highlight,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center mb-16 md:mb-20">
      {badge && (
        <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20 rounded-md">
          {badge}
        </Badge>
      )}
      <h2 className="max-w-2xl text-3xl font-bold md:text-5xl tracking-tight">
        {title}{" "}
        {highlight && (
          <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
            {highlight}
          </span>
        )}
      </h2>
      <p className="text-muted-foreground md:text-lg max-w-2xl mt-2">
        {description}
      </p>
    </div>
  );
}
