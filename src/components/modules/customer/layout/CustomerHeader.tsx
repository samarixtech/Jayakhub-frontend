import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@radix-ui/react-separator";
import { ChevronDown, MapPin } from "lucide-react";
import Image from "next/image";

function CustomerHeader() {
  return (
    <header className="p-4 flex shrink-0 items-center">
      <div className="flex w-full items-center justify-between bg-[#346853] h-16 px-6 rounded-3xl shadow-lg">
        {/* Left Side Trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-white/10" />
          <Separator orientation="vertical" className="h-6 bg-white/20" />

          {/* Location Picker  */}
          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-1.5 rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
            <MapPin className="h-4 w-4 text-emerald-bg" />
            <span className="text-sm font-bold text-emerald-bg">
              New York, NY
            </span>
            <ChevronDown className="h-3 w-3 text-emerald-bg" />
          </div>
        </div>

        {/* Right Side User Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <Typography className="text-white font-bold text-sm leading-none">
              John Doe
            </Typography>
            <Typography className="text-white/70 text-[10px] uppercase tracking-widest font-medium mt-0.5">
              Administrator
            </Typography>
          </div>
          <div className="h-10 w-10 rounded-full border-2 border-white/20 overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
              alt="User"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default CustomerHeader;
