"use client";

import { Spinner } from "./spinner";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("relative", className)}
      {...props}
    >
      {loading && <Spinner className="shrink-0" />}
      <span className={cn("inline-flex items-center gap-1.5", loading && loadingText ? "opacity-70" : "")}>
        {loading && loadingText ? loadingText : children}
      </span>
    </Button>
  );
}
