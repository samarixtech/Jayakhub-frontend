"use client";
import { useState } from "react";
import Image from "next/image";
import { Star, X, Utensils, Bike } from "lucide-react";
import { GlobalModal } from "./GlobalModal";
import { submitRatingAction } from "@/app/actions/customer/order";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

interface RatingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderInfo: {
    orderNumber: string;
    restaurantName: string;
    items: {
      id: string;
      originalId: string | null;
      orderItemId: string | null;
      name: string;
      price: number;
      quantity: number;
      options?: string;
      image: string;
    }[];
    delivery: {
      driverName: string;
      vehicle: string;
      time: string;
      driverImage: string;
    };
    rawOrder?: any;
  };
}

export function RatingModal({
  open,
  onOpenChange,
  orderInfo,
}: RatingModalProps) {
  const t = useTranslations("RatingModal");
  const [overallRating, setOverallRating] = useState(0);
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleItemRating = (id: string, rating: number) => {
    setItemRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const handleSubmit = async () => {
    if (!orderInfo.rawOrder) return;

    setIsSubmitting(true);
    let successCount = 0;

    // Submit rating for each rated item
    for (const item of orderInfo.items || []) {
      const itemRating = itemRatings[item.id] || overallRating;
      if (itemRating > 0) {
        const payload = {
          orderId: orderInfo.rawOrder.orderId,
          restaurantId: orderInfo.rawOrder.restaurantId,
          ...(item.originalId ? { itemId: item.originalId } : {}),
          ...(item.orderItemId ? { orderItemId: item.orderItemId } : {}),
          rating: itemRating,
          isRecommended: itemRating >= 4,
          comment: comment,
        };
        const res = await submitRatingAction(payload);
        if (res.success) {
          successCount++;
        }
      }
    }

    setIsSubmitting(false);

    if (successCount > 0) {
      toast.success(t("toastSuccess"));
      onOpenChange(false);
    } else if (overallRating === 0 && Object.keys(itemRatings).length === 0) {
      toast.error(t("toastRateAtLeastOne"));
    } else {
      toast.error(t("toastFailed"));
    }
  };

  const renderStars = (
    currentRating: number,
    onRate: (rating: number) => void,
    size: "lg" | "sm" = "sm",
  ) => {
    return (
      <div className="flex gap-1.5 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            className={`transition-colors shrink-0 ${
              star <= currentRating ? "text-amber-400" : "text-gray-300"
            }`}
          >
            <Star
              className={
                size === "lg"
                  ? "w-10 h-10 fill-current"
                  : "w-6 h-6 fill-current"
              }
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <GlobalModal
      trigger={<div className="hidden" />}
      open={open}
      onOpenChange={onOpenChange}
      className="p-6 md:p-8 max-h-[90vh] overflow-y-auto sm:max-w-[500px]"
    >
      <div className="flex items-start justify-between mb-8 -mt-2 -mx-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E8F5F0] flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-[#346853]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">
              {t("title")}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {orderInfo.orderNumber} • {orderInfo.restaurantName}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Overall Experience */}
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-gray-900">
            {t("overallQuestion")}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{t("tapToRate")}</p>
          <div className="flex justify-center">
            {renderStars(overallRating, setOverallRating, "lg")}
          </div>
        </div>

        {/* Rate Each Item */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <h4 className="font-bold text-gray-900 mb-4">{t("rateEachItem")}</h4>
          <div className="space-y-6">
            {(orderInfo.items || []).map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 relative flex items-center justify-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Utensils className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </h5>
                    <span className="font-semibold text-[#346853] text-sm shrink-0">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ×{item.quantity} {item.options ? `• ${item.options}` : ""}
                  </p>
                  <div className="mt-1">
                    {renderStars(
                      itemRatings[item.id] || 0,
                      (rating) => handleItemRating(item.id, rating),
                      "sm",
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery */}
        <div className="bg-gray-50 rounded-2xl p-5 flex gap-4 items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-emerald-100 shrink-0 relative flex items-center justify-center">
            {orderInfo.delivery.driverImage ? (
              <Image
                src={orderInfo.delivery.driverImage}
                alt={orderInfo.delivery.driverName}
                fill
                className="object-cover"
              />
            ) : (
              <Bike className="w-6 h-6 text-emerald-600" />
            )}
          </div>
          <div className="flex-1">
            <h5 className="font-semibold text-gray-900 text-sm">
              {t("deliveryBy", { name: orderInfo.delivery.driverName })}
            </h5>
          </div>
        </div>

        {/* Additional Comments */}
        <div className="bg-gray-50 rounded-2xl p-5">
          <h4 className="font-bold text-gray-900 mb-3">
            {t("additionalComments")}
          </h4>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t("commentPlaceholder")}
            className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-700 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853] transition-all resize-none h-24"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#82A896] hover:bg-[#6e9281] disabled:opacity-70 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? t("submitting") : t("submitRating")}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 rounded-xl transition-colors"
          >
            {t("skip")}
          </button>
        </div>
      </div>
    </GlobalModal>
  );
}
