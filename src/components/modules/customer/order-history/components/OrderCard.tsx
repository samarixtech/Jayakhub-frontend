import Image from "next/image";
import { Search, RefreshCw, Star, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus } from "../../types";
import {
  getImageUrl,
  getStatusColor,
  getStatusLabel,
} from "../useOrderHistoryActions";
import { useTranslations } from "next-intl";
import { useCLC } from "@/context/CLCContext";

interface OrderCardProps {
  order: Order;
  handleReorder: (order: Order) => void;
  handleRateOrder: (order: Order) => void;
  handleCancelOrder: (order: Order) => void;
}

export const OrderCard = ({
  order,
  handleReorder,
  handleRateOrder,
  handleCancelOrder,
}: OrderCardProps) => {
  const t = useTranslations("CustomerDashboard.OrderHistory");
  const isRejected =
    order.OrderStatus.toLowerCase() === OrderStatus.REJECTED ||
    order.OrderStatus.toLowerCase() === OrderStatus.CANCELLED ||
    order.OrderStatus.toLowerCase() === OrderStatus.RIDER_NOT_ASSIGNED;
  const isDelivered = order.OrderStatus.toLowerCase() === OrderStatus.DELIVERED;
  const firstItem = order.items?.[0];
  const itemNames = order.items
    ?.map((i) => `${i.quantity}x ${i.name}`)
    .join(", ");
  const displayTitle = firstItem?.name || t("order_default");

  const { formatPrice } = useCLC();

  return (
    <Card
      key={order.orderId}
      className={`border-none shadow-sm rounded-3xl overflow-hidden transition-all hover:shadow-md ${
        isRejected ? "bg-red-50" : "bg-white"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center p-5 gap-6">
          {/* Left Image & Info */}
          <div className="flex items-center gap-4 w-full md:w-[35%] min-w-0">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-100 overflow-hidden relative">
              {firstItem?.image ? (
                <Image
                  src={getImageUrl(firstItem.image)}
                  alt={firstItem.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-gray-300">
                  <Search size={20} />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-excep font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-1">
                {displayTitle}
              </h3>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                {order.orderId} • {order.orderDate}
              </p>
              <p className="text-[11px] text-gray-500 font-semibold mt-1 uppercase">
                {t("payment_method")}: {order.paymentMethod}
              </p>
            </div>
          </div>

          {/* Middle Items Summary */}
          <div className="hidden md:block w-[30%] min-w-0">
            <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed break-words">
              {itemNames}
            </p>
          </div>

          {/* Right Status & Actions */}
          <div className="flex items-center justify-end gap-6 w-full md:w-auto md:shrink-0 ml-auto">
            <div
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
                order.OrderStatus,
              )}`}
            >
              {isDelivered && <span>✓</span>}
              {isRejected && <span>✕</span>}
              {getStatusLabel(order.OrderStatus, t)}
            </div>

            <span className="font-semibold text-gray-900 text-sm text-right whitespace-nowrap">
              {formatPrice(order.totalAmount, 0)}
            </span>

            {isRejected ? (
              <></>
            ) : isDelivered ? (
              <Button
                className="rounded-full h-9 px-5 bg-[#2E5C46] hover:bg-[#234535] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
                onClick={() => handleReorder(order)}
              >
                <RefreshCw size={12} />
                {t("reorder")}
              </Button>
            ) : (
              <div className="flex gap-2 items-center">
                {order.OrderStatus.toLowerCase() === "pending" && order.paymentMethod?.toLowerCase() === "cod" && (
                  <Button
                    variant="outline"
                    className="rounded-full h-9 px-5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-[11px] font-bold shadow-sm cursor-pointer"
                    onClick={() => handleCancelOrder(order)}
                  >
                    {t("cancel_order_btn")}
                  </Button>
                )}
                <Button
                  className="rounded-full h-9 px-5 bg-[#2E5C46] hover:bg-[#234535] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
                  onClick={() => {
                    window.location.href = `/order/${order.orderId}`;
                  }}
                >
                  <Navigation size={12} />
                  {t("track")}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Rating and Review Block for Delivered Orders */}
        {isDelivered &&
          (() => {
            const ratedItem = order.items?.find(
              (item) => item.rate && item.rate > 0,
            );
            const hasGivenReview = !!ratedItem;
            const ratingValue = ratedItem?.rate || 5;
            const reviewText =
              ratedItem?.comment || t("default_review_message");
            const replyText = ratedItem?.reply;

            return (
              <div className="bg-[#FAFAFA] border border-gray-100 p-5 mx-5 mb-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {hasGivenReview ? (
                  <div className="flex-1 w-full flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold text-gray-800 text-sm">
                        {t("your_review")}
                      </span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < ratingValue
                                ? "fill-[#f5a623] text-[#f5a623]"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#657a8a] text-[13px] italic font-medium">
                      &quot;{reviewText}&quot;
                    </p>

                    {replyText && (
                      <div className="mt-2.5 bg-[#E2F1E8] border border-[#357252]/10 p-4 rounded-xl flex flex-col gap-2 w-full">
                        <span className="text-[11px] font-bold text-[#357252] uppercase tracking-wider flex items-center gap-1.5">
                          <RefreshCw
                            size={12}
                            className="scale-x-[-1] shrink-0"
                          />
                          {t("restaurant_reply")}
                        </span>
                        <p className="text-[13px] text-[#1b2d22] leading-relaxed font-medium">
                          {replyText}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">
                        {t("no_review_given")}
                      </h4>
                      <p className="text-gray-500 text-xs">
                        {t("share_experience")}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full bg-white border-gray-200 text-gray-800 text-[12px] font-bold h-10 px-5 hover:bg-gray-50 w-full md:w-auto shadow-sm"
                      onClick={() => handleRateOrder(order)}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {t("rate_order")}
                    </Button>
                  </>
                )}
              </div>
            );
          })()}
      </CardContent>
    </Card>
  );
};
