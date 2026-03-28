import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface AuthDividerProps {
  text: string;
  compact?: boolean;
}

export function AuthDivider({ text, compact }: AuthDividerProps) {
  return (
    <div
      className={cn(
        "relative text-center transition-all",
        compact ? "mb-3" : "mb-6",
      )}
    >
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full border-gray-100" />
      </div>
      <div className="relative flex justify-center uppercase">
        <Typography
          as="span"
          className="bg-white px-4 text-[11px] text-gray-400 font-black tracking-widest"
        >
          {text}
        </Typography>
      </div>
    </div>
  );
}
