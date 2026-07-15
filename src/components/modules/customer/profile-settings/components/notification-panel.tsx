"use client";
import { ArrowLeft, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationsContent } from "./notifications/notifications-content";
import { useTranslations } from "next-intl";

interface NotificationPanelProps {
  onBack: () => void;
  className?: string;
  initialNotifications?: any[];
  isLoading?: boolean;
  userRole?: string;
  onNavigate?: () => void;
}

export default function NotificationPanel({
  onBack,
  className,
  initialNotifications = [],
  isLoading = false,
  userRole = "customer",
  onNavigate,
}: NotificationPanelProps) {
  const t = useTranslations("CustomerDashboard.ProfileSettings");
  return (
    <div className={cn("flex flex-col h-full bg-white", className)}>
      <div className="flex flex-row items-center gap-2 border-b border-gray-100 p-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </Button>
        <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600" />
          {t("notifications")}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[300px]">
        <NotificationsContent
          notifications={initialNotifications}
          isLoading={isLoading}
          userRole={userRole}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}
