import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-border bg-bg-subtle px-3 py-2 text-sm",
        "placeholder:text-fg-subtle",
        "focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
