import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const StepSchedule = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <Typography variant={"h4"} className="font-bold text-gray-900">
      Operating Hours
    </Typography>
    <div className="space-y-3">
      {DAYS.map((day) => (
        <div
          key={day}
          className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl"
        >
          <span className="text-sm font-bold text-gray-700 w-24">{day}</span>
          <div className="flex items-center gap-3">
            <Input
              className="w-24 h-9 bg-gray-50/50 text-center text-xs border-none"
              defaultValue="09:00 AM"
            />
            <span className="text-xs text-gray-400 font-bold">to</span>
            <Input
              className="w-24 h-9 bg-gray-50/50 text-center text-xs border-none"
              defaultValue="11:00 PM"
            />
          </div>
          <Switch defaultChecked />
        </div>
      ))}
    </div>
  </div>
);
