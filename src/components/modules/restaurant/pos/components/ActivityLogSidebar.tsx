"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Bell,
  XCircle,
  MapPin,
  Bike,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { getNotifications } from "@/app/actions/customer/notifications";
import { useTranslations } from "next-intl";

interface ActivityLogSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ActivityLogSidebar({
  open,
  onOpenChange,
}: ActivityLogSidebarProps) {
  const t = useTranslations("POS.activityLog");
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchLogs();
    }
  }, [open]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await getNotifications();
      if (res.success && res.data) {
        const notifications = Array.isArray(res.data)
          ? res.data
          : res.data.data || [];
        setLogs(notifications);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    const time = d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    return `${time} · ${day} ${month}`;
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "order_rejected":
        return { icon: XCircle, bg: "bg-red-50", color: "text-red-500" };
      case "rider_arrived":
        return { icon: MapPin, bg: "bg-emerald-50", color: "text-[#357252]" };
      case "rider_arriving":
        return { icon: MapPin, bg: "bg-[#fff1d6]", color: "text-[#c97a22]" };
      case "rider_en_route":
      case "rider_assigned":
        return { icon: Bike, bg: "bg-blue-50", color: "text-blue-500" };
      case "order_ready":
        return {
          icon: ShoppingCart,
          bg: "bg-[#fff1d6]",
          color: "text-[#c97a22]",
        };
      default:
        return { icon: Bell, bg: "bg-[#fff1d6]", color: "text-[#c97a22]" };
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[400px] border-l-0 p-0 bg-white flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-gray-100 shrink-0 text-left">
          <SheetTitle className="text-[18px] sm:text-[20px] font-black text-[#1f2937]">
            {t("title")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex justify-center py-10 text-gray-400 font-medium text-[13px]">
              {t("empty")}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {logs.map((log) => {
                const { icon: Icon, bg, color } = getIconForType(log.type);
                return (
                  <div key={log.id} className="flex gap-4 items-start group">
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bg}`}
                    >
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex flex-col pt-1">
                      <span className="text-[13px] font-bold text-[#1f2937] leading-tight group-hover:text-[#357252] transition-colors cursor-pointer">
                        {log.body || log.title}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400 mt-1">
                        {formatTime(log.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
