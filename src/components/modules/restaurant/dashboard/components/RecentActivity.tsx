import { ShoppingBag, Star, CheckCircle, Banknote } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  activities: any[];
  getTimeAgo: (dateString: string) => string;
}

// Map activity types to styles
const ACTIVITY_CONFIG: Record<
  string,
  { icon: any; bgColor: string; iconColor: string }
> = {
  NEW_ORDER: {
    icon: ShoppingBag,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  RATING: { icon: Star, bgColor: "bg-orange-50", iconColor: "text-orange-500" },
  ORDER_COMPLETED: {
    icon: CheckCircle,
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  WEEKLY_PAYOUT: {
    icon: Banknote,
    bgColor: "bg-purple-50",
    iconColor: "text-purple-500",
  },
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  getTimeAgo,
}) => {
  const t = useTranslations("RestaurantDashboard");

  return (
    <Card className="rounded-[16px] border-gray-100 shadow-sm flex flex-col h-[360px] pt-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-[16px] font-bold text-[#1b2d22]">
          {t("recentActivity.title")}
        </CardTitle>
        <CardDescription className="text-[12px] text-[#8ea89a] font-medium mt-0.5">
          {t("recentActivity.subtitle")}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 pt-0">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col gap-6">
            {activities && activities.length > 0 ? (
              activities.map((activity, idx) => {
                const config =
                  ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.NEW_ORDER;
                const Icon = config.icon;

                return (
                  <div
                    key={activity.id || idx}
                    className="flex gap-4 items-start group"
                  >
                    {/* Icon Container */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                        config.bgColor,
                      )}
                    >
                      <Icon className={cn("w-4 h-4", config.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#1b2d22] leading-tight">
                        {activity.title}
                      </span>
                      <span className="text-[11px] font-medium text-[#8ea89a] mt-1">
                        {getTimeAgo(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-sm text-muted-foreground italic">
                {t("recentActivity.noActivity")}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
