"use client";
import { ArrowLeft, Bell, Star, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import { useRouter, useParams } from "next/navigation";
import useLocale from "@/hooks/useLocals";

interface NotificationPanelProps {
  onBack: () => void;
  className?: string;
  initialNotifications?: any[];
  isLoading?: boolean;
  userRole?: string;
  onNavigate?: () => void;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

function getNotificationIcon(notification: Notification) {
  const title = notification.title.toLowerCase();
  const body = notification.body.toLowerCase();

  if (title.includes("rating") || title.includes("review") || body.includes("rating") || body.includes("review")) {
    return <Star className="h-5 w-5 text-zinc-400 shrink-0" />;
  }

  // Default to food/order icon for other notifications (orders, accepted, etc.)
  return <Utensils className="h-5 w-5 text-zinc-400 shrink-0" />;
}

export default function NotificationPanel({
  onBack,
  className,
  initialNotifications = [],
  isLoading = false,
  userRole = "customer",
  onNavigate,
}: NotificationPanelProps) {
  const notifications = initialNotifications;
  const router = useRouter();
  const { country: localeCountry, language: localeLanguage } = useLocale();
  const params = useParams();

  const country = (params?.country as string) || localeCountry || "pk";
  const language = (params?.language as string) || localeLanguage || "en";

  const handleNotificationClick = (notification: Notification) => {
    // Determine route based on notification content
    const title = notification.title.toLowerCase();
    const body = notification.body.toLowerCase();

    let path = "";
    const isRestaurant = userRole === "restaurant_owner";
    const basePath = `/${country}/${language}/${isRestaurant ? "restaurant" : "customer"}`;

    if (title.includes("rating") || title.includes("review") || body.includes("rating") || body.includes("review")) {
      // Navigate to reviews page
      path = isRestaurant ? `${basePath}/reviews` : `${basePath}/orders`; // Customers usually see reviews on their past orders
    } else if (title.includes("order") || body.includes("order") || title.includes("accepted") || title.includes("rejected")) {
      // Navigate to orders page
      path = isRestaurant ? `${basePath}/orders` : `${basePath}/order-history`;
    }

    if (path) {
      router.push(path);
      if (onNavigate) {
        onNavigate(); // Close the dropdown/panel
      }
    }
  };

  console.log("NotificationPanel: Rendered with", { notifications, isLoading });

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
          Notifications
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[300px]">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">
            <Typography className="text-xs">
              Loading notifications...
            </Typography>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-5 py-3 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? "bg-emerald-50/30" : ""
                    }`}
                >
                  <div className="mt-0.5">
                    {getNotificationIcon(notification)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`text-xs font-bold line-clamp-1 ${!notification.isRead ? "text-gray-900" : "text-gray-700"
                          }`}
                      >
                        {notification.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {getRelativeTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                      {notification.body}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <Typography className="text-xs">
                  No new notifications
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
