import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      p: "leading-",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      // Custom variants for specific dashboard needs if standard ones don't fit perfectly
      "card-title": "text-sm font-bold text-slate-800 tracking-tight",
      "activity-title":
        "text-sm font-semibold text-foreground truncate leading-none mb-1",
      "activity-time": "text-xs text-muted-foreground font-medium",
      "display-count": "text-3xl font-bold text-foreground mb-4",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as, ...props }, ref) => {
    let Comp = as || "p";
    // Default mapping for semantic HTML tags based on variant
    if (!as && variant) {
      if (variant === "h1") (Comp as any) = "h1";
      else if (variant === "h2") (Comp as any) = "h2";
      else if (variant === "h3") (Comp as any) = "h3";
      else if (variant === "h4") (Comp as any) = "h4";
      // Add specific mappings for custom variants if needed, or default to p/div
      else if (variant === "display-count") (Comp as any) = "h3";
    }

    return (
      <Comp
        className={cn(typographyVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Typography.displayName = "Typography";

export { Typography, typographyVariants };
