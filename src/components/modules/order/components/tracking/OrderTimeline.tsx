import React from "react";
import { TimelineItem } from "./TimelineItem";
import { Check, Utensils, Bike, MapPin, XCircle } from "lucide-react";
import { formatOrderDateTime } from "@/lib/utils/date";

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
  const isRejected = orderStatus === "rejected";

  if (isRejected) {
    return (
      <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Order Journey</h2>
        <div className="pl-2">
          <TimelineItem
            icon={Check}
            title="Order Confirmed"
            description="We received your order and forwarded it to the restaurant."
            time={formatOrderDateTime(orderDate, orderTime)}
            status="pending"
          />
          <TimelineItem
            icon={XCircle}
            title="Order Cancelled"
            description="This order was cancelled by the restaurant."
            status="pending"
            isLast={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Order Journey</h2>

      <div className="pl-2">
        <TimelineItem
          icon={Check}
          title="Order Confirmed"
          description="We've received your order and the restaurant is starting soon."
          time={formatOrderDateTime(orderDate, orderTime)}
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
          title="Preparing your food"
          description="The chef is working their magic! Your order is being packed."
          status={
            ["prepare", "preparing"].includes(orderStatus)
              ? "active"
              : ["out_of_delivery", "delivered"].includes(orderStatus)
                ? "completed"
                : "pending"
          }
        />
        <TimelineItem
          icon={Bike}
          title="On the way"
          description="Hang tight! Your rider will be heading to you soon."
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
          title="Delivered"
          description="Enjoy your meal! Don't forget to rate the restaurant."
          status={orderStatus === "delivered" ? "completed" : "pending"}
          isLast={true}
        />
      </div>
    </div>
  );
};
