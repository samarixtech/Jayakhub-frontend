import React from "react";
import { TimelineItem } from "./TimelineItem";
import { Check, Utensils, Bike, MapPin } from "lucide-react";

interface OrderTimelineProps {
  orderTime: string;
  orderStatus: string;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  orderTime,
  orderStatus,
}) => {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-8">Order Journey</h2>

      <div className="pl-2">
        <TimelineItem
          icon={Check}
          title="Order Confirmed"
          description="We've received your order and the restaurant is starting soon."
          time={orderTime}
          status="completed"
        />
        <TimelineItem
          icon={Utensils}
          title="Preparing your food"
          description="The chef is working their magic! Your order is being packed."
          status={
            orderStatus === "preparing" || orderStatus === "paid"
              ? "active"
              : "pending"
          }
          time="Expected 12:30 PM"
        />
        <TimelineItem
          icon={Bike}
          title="On the way"
          description="Hang tight! Your rider will be heading to you soon."
          status={orderStatus === "on_the_way" ? "active" : "pending"}
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
