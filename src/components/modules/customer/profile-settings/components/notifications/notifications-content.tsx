"use client";
import { Bell, Star, Utensils } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";
import { useNotifications, Notification } from "./useNotifications";

export function getRelativeTime(dateString: string, t: any) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return t("years_ago", { count: Math.floor(interval) });
  interval = seconds / 2592000;
  if (interval > 1) return t("months_ago", { count: Math.floor(interval) });
  interval = seconds / 86400;
  if (interval > 1) return t("days_ago", { count: Math.floor(interval) });
  interval = seconds / 3600;
  if (interval > 1) return t("hours_ago", { count: Math.floor(interval) });
  interval = seconds / 60;
  if (interval > 1) return t("minutes_ago", { count: Math.floor(interval) });
  return t("seconds_ago", { count: Math.floor(seconds) });
}

export function getNotificationIcon(notification: Notification) {
  const title = notification.title.toLowerCase();
  const body = notification.body.toLowerCase();

  if (
    title.includes("rating") ||
    title.includes("review") ||
    body.includes("rating") ||
    body.includes("review")
  ) {
    return <Star className="h-5 w-5 text-zinc-400 shrink-0" />;
  }
  return <Utensils className="h-5 w-5 text-zinc-400 shrink-0" />;
}

interface NotificationsContentProps {
  notifications: Notification[];
  isLoading: boolean;
  userRole: string;
  onNavigate?: () => void;
}

export function NotificationsContent({
  notifications,
  isLoading,
  userRole,
  onNavigate,
}: NotificationsContentProps) {
  const { handleNotificationClick } = useNotifications(userRole, onNavigate);
  const t = useTranslations("CustomerDashboard.ProfileSettings");

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400">
        <Typography className="text-xs">{t("loading_notifications")}</Typography>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <Typography className="text-xs">{t("no_new_notifications")}</Typography>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-50">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => handleNotificationClick(notification)}
          className={`px-5 py-3 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${
            !notification.isRead ? "bg-emerald-50/30" : ""
          }`}
        >
          <div className="mt-0.5">{getNotificationIcon(notification)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <h4
                className={`text-xs font-bold line-clamp-1 ${
                  !notification.isRead ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {notification.title}
              </h4>
              <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                {getRelativeTime(notification.createdAt, t)}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-snug line-clamp-2">
              {notification.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
