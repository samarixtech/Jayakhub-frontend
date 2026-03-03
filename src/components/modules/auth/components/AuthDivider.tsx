import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";

interface AuthDividerProps {
  text: string;
}

export function AuthDivider({ text }: AuthDividerProps) {
  return (
    <div className="relative mb-6 text-center">
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
