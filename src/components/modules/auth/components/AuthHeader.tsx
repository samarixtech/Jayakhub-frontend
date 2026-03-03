import { CardHeader } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <CardHeader className="px-0 pt-0 text-center">
      <Typography variant="h2" className="text-3xl font-bold text-emerald-bg">
        {title}
      </Typography>
      <Typography variant="muted" className="mt-2">
        {description}
      </Typography>
    </CardHeader>
  );
}
