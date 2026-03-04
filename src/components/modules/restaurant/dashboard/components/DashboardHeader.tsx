import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";

interface DashboardHeaderProps {
  isOnline: boolean;
  setIsOnline: (checked: boolean) => void;
  isToggling?: boolean;
  ownerName: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isOnline,
  setIsOnline,
  isToggling = false,
  ownerName,
}) => {
  // DYNAMIC GREETING BASED ON TIME
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  }, []);

  return (
    <Card className="border-none bg-emerald-bg overflow-hidden rounded-2xl shadow-md">
      <CardContent className="flex items-center justify-between px-6 py-5">
        <div className="space-y-1">
          <h1 className="text-white text-xl font-bold flex items-center gap-2">
            {greeting}, {ownerName || "JOHN DOE"}{" "}
            <span className="animate-bounce-short">👋</span>
          </h1>
          <p className="text-emerald-100/80 text-sm font-medium">
            Your restaurant is ready to receive orders
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 transition-all hover:bg-white/15">
          <Label
            htmlFor="online-status"
            className="text-white text-sm font-semibold cursor-pointer"
          >
            {isOnline ? "Online" : "Offline"}
          </Label>
          <Switch
            id="online-status"
            checked={isOnline}
            onCheckedChange={setIsOnline}
            disabled={isToggling}
            className="data-[state=checked]:bg-[#1eb589] data-[state=unchecked]:bg-slate-400/50 disabled:opacity-50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
