import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  value: string | number;
  trend: string;
  changeText: string;
}

export const MetricsCard: React.FC<StatCardProps> = ({
  title,
  icon: Icon,
  iconBgColor,
  iconColor,
  value,
  trend,
  changeText,
}) => {
  const isDown = trend === "down" || trend?.includes("-");

  return (
    <Card className="rounded-[16px] border-gray-100 shadow-sm flex flex-col justify-between h-[130px]">
      <CardContent className="p-5 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-[#657a8a] text-[12px] font-bold">{title}</span>
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgColor} ${iconColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[#1b2d22] text-[28px] font-black leading-none">
            {value}
          </span>
          <div
            className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-[5px] text-[10px] font-bold ${
              isDown
                ? "bg-[#fff0f0] text-[#ef4444]"
                : "bg-[#edf8eb] text-[#1eb589]"
            }`}
          >
            {isDown ? (
              <ArrowDownRight className="w-3 h-3 stroke-3" />
            ) : (
              <ArrowUpRight className="w-3 h-3 stroke-3" />
            )}
            {changeText}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
