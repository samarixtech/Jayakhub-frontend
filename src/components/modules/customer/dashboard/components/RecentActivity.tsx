import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "../../types";
import { getStatusColor, getStatusLabel } from "../utils";
import { useTranslations } from "next-intl";
import { formatOrderDateTime } from "@/lib/utils/date";

interface RecentActivityProps {
  recentOrders: Order[];
  loading: boolean;
  country: string;
  language: string;
}

export const RecentActivity = ({
  recentOrders,
  loading,
  country,
  language,
}: RecentActivityProps) => {
  const t = useTranslations("CustomerDashboard.RecentActivity");

  return (
    <Card className="lg:col-span-2 border-none shadow-sm rounded-4xl bg-white overflow-hidden">
      <CardHeader className="px-8 pt-8 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-black text-gray-900">
          {t("recent_activity")}
        </CardTitle>
        <Button
          variant="link"
          className="text-emerald-600 font-bold text-xs p-0 h-auto"
          asChild
        >
          <Link href={`/${country}/${language}/customer/order-history`}>
            {t("view_all")}
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="px-8 pb-8 space-y-6 mt-4">
        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          recentOrders.map((order) => {
            const statusStyle = getStatusColor(order.OrderStatus);
            const firstItem =
              order.items && order.items.length > 0 ? order.items[0] : null;

            const orderName = firstItem
              ? firstItem.name
              : `Order #${order.orderId.substring(0, 8)}`;

            const itemCount = (order.items || []).reduce(
              (acc, item) => acc + item.quantity,
              0,
            );

            // Image URL logic
            let imageUrl = null;
            if (firstItem?.image) {
              imageUrl = firstItem.image.startsWith("http")
                ? firstItem.image
                : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${firstItem.image.replace(/\\/g, "/")}`;
            }

            return (
              <div
                key={order.orderId}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={orderName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ShoppingBag className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Typography className="font-bold text-gray-900 text-sm">
                      {orderName}
                    </Typography>
                    <Typography className="text-xs text-gray-400 font-medium">
                      {itemCount} {itemCount === 1 ? t("item") : t("items")} • $
                      {order.totalAmount}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`rounded-full px-3 py-0.5 text-[10px] font-bold border-none ${statusStyle.bg} ${statusStyle.color}`}
                  >
                    {getStatusLabel(order.OrderStatus)}
                  </Badge>
                  <Typography className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-tighter">
                    {formatOrderDateTime(order.orderDate, order.orderTime)}
                  </Typography>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            {t("no_activity")}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
