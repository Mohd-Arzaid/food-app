import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    {
      label,
      variant = "input",
      className,
      error,
      type,
      rightElement,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const inputClasses = cn(
      "w-full rounded-lg bg-background text-foreground placeholder:text-muted-foreground outline-none transition-colors border",
      error
        ? "border-destructive text-destructive focus:border-destructive ring-1 ring-destructive/20"
        : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20",
      variant === "textarea" ? "px-4 py-3 resize-none" : "h-12 px-4",
      rightElement && "pr-11",
      className
    );

    const inputNode =
      variant === "textarea" ? (
        <textarea ref={ref} rows={rows} className={inputClasses} {...props} />
      ) : (
        <div className="relative w-full">
          <input ref={ref} type={type} className={inputClasses} {...props} />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-muted-foreground">
              {rightElement}
            </div>
          )}
        </div>
      );

    if (label || error) {
      return (
        <div className="space-y-1.5 w-full text-left">
          {label && (
            <label className="text-sm font-medium text-foreground block">
              {label}
            </label>
          )}
          {inputNode}
          {error && (
            <p className="text-destructive text-xs sm:text-sm font-medium">
              {error}
            </p>
          )}
        </div>
      );
    }

    return inputNode;
  }
);
Input.displayName = "Input";

export { Input };
