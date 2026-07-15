import React from "react";
import { TimelineItem } from "./TimelineItem";
import { Check, Utensils, Bike, MapPin, XCircle, ShoppingBag } from "lucide-react";
import { formatOrderDateTime } from "@/lib/utils/date";
import { useTranslations } from "next-intl";

interface OrderTimelineProps {
  orderDate: string;
  orderTime: string;
  orderStatus: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  orderDate,
  orderTime,
  orderStatus,
}) => {
  const t = useTranslations("OrderTracking");
  const isRejected = orderStatus === "rejected";
  const isCancelled = orderStatus === "cancelled";
  const isRiderNotAssigned = orderStatus === "rider_not_assigned";

  if (isRiderNotAssigned) {
    return (
      <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-8">{t("journeyTitle")}</h2>
        <div className="pl-2">
          <TimelineItem
            icon={ShoppingBag}
            title={t("placedTitle")}
            description={t("placedDesc")}
            time={formatOrderDateTime(orderDate, orderTime)}
            status="completed"
          />
          <TimelineItem
            icon={Check}
            title={t("confirmedTitle")}
            description={t("confirmedDesc")}
            status="completed"
          />
          <TimelineItem
            icon={Utensils}
            title={t("preparingTitle")}
            description={t("preparingDesc")}
            status="completed"
          />
          <TimelineItem
            icon={XCircle}
            title={t("riderNotAssignedTitle")}
            description={t("riderNotAssignedDesc")}
            status="completed"
            isLast={true}
          />
        </div>
      </div>
    );
  }

  if (isCancelled) {
    return (
      <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-8">{t("journeyTitle")}</h2>
        <div className="pl-2">
          <TimelineItem
            icon={ShoppingBag}
            title={t("placedTitle")}
            description={t("placedDesc")}
            time={formatOrderDateTime(orderDate, orderTime)}
            status="completed"
          />
          <TimelineItem
            icon={XCircle}
            title={t("cancelledTitle")}
            description={t("cancelledDesc")}
            status="completed"
            isLast={true}
          />
        </div>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-8">{t("journeyTitle")}</h2>
        <div className="pl-2">
          <TimelineItem
            icon={ShoppingBag}
            title={t("placedTitle")}
            description={t("placedDesc")}
            time={formatOrderDateTime(orderDate, orderTime)}
            status="completed"
          />
          <TimelineItem
            icon={XCircle}
            title={t("cancelledTitle")}
            description={t("cancelledByRestaurantDesc")}
            status="completed"
            isLast={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-8">{t("journeyTitle")}</h2>

      <div className="pl-2">
        <TimelineItem
          icon={ShoppingBag}
          title={t("placedTitle")}
          description={t("placedDesc")}
          time={formatOrderDateTime(orderDate, orderTime)}
          status="completed"
        />
        <TimelineItem
          icon={Check}
          title={t("confirmedTitle")}
          description={t("confirmedDescActive")}
          status={
            orderStatus === "pending"
              ? "pending"
              : ["accepted", "paid"].includes(orderStatus)
                ? "active"
                : "completed"
          }
        />
        <TimelineItem
          icon={Utensils}
          title={t("preparingTitle")}
          description={t("preparingDesc")}
          status={
            ["prepare", "preparing"].includes(orderStatus)
              ? "active"
              : ["ready", "out_of_delivery", "delivered"].includes(orderStatus)
                ? "completed"
                : "pending"
          }
        />
        <TimelineItem
          icon={Bike}
          title={t("onTheWayTitle")}
          description={t("onTheWayDesc")}
          status={
            orderStatus === "out_of_delivery"
              ? "active"
              : orderStatus === "delivered"
                ? "completed"
                : "pending"
          }
        />
        <TimelineItem
          icon={MapPin}
          title={t("deliveredTitle")}
          description={t("deliveredDesc")}
          status={orderStatus === "delivered" ? "completed" : "pending"}
          isLast={true}
        />
      </div>
    </div>
  );
};
