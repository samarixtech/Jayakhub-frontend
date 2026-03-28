import { CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
interface AuthHeaderProps {
  title: string;
  description: string;
  className?: string;
  compact?: boolean;
}

export function AuthHeader({
  title,
  description,
  className,
  compact,
}: AuthHeaderProps) {
  return (
    <CardHeader className={cn("px-0 pt-0 text-center", className)}>
      <Typography
        variant="h2"
        className={cn(
          "font-bold text-emerald-bg transition-all p-0",
          compact ? "text-2xl" : "text-3xl",
        )}
      >
        {title}
      </Typography>
      <Typography variant="muted">{description}</Typography>
    </CardHeader>
  );
}
