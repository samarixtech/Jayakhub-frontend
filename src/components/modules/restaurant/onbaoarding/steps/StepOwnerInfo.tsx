import { User, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

export const StepOwnerInfo = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <Typography variant={"h4"} className="font-bold text-gray-900">
      Who manages this restaurant?
    </Typography>
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-gray-400">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
            placeholder="John Doe"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase text-gray-400">
          Contact Phone
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
            placeholder="+964 000 000 0000"
          />
        </div>
        <Typography className="text-[10px] text-gray-400">
          We will send important updates to this number.
        </Typography>
      </div>
    </div>
  </div>
);
