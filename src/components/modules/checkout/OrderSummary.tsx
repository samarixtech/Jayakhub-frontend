"use client";
import { useState } from "react";
import { Clock, Loader2, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCLC } from "@/context/CLCContext";
import { toast } from "react-hot-toast";
import { validateCouponAction } from "@/app/actions/public/coupon";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CartItem {
  id?: string;
  cartId?: string;
  name: string;
  price: number;
  basePrice?: number;
  originalPrice?: number;
  discount?: string | null;
  quantity: number;
  restaurantName?: string;
  selectedVariations?: { name: string }[];
}

interface AppliedCoupon {
  couponCode: string;
  discountAmount: number;
  finalTotal: number;
}

interface OrderSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  cartItems: CartItem[];
  // Items from a /reorder call that are no longer available — shown for
  // context only, never counted toward subtotal/total or sent to checkout.
  unavailableItems?: CartItem[];
  onPlaceOrder?: () => void;
  isPlacingOrder?: boolean;
  isEstimatingDelivery?: boolean;
  couponCode: string;
  setCouponCode: (val: string) => void;
  onCouponApplied?: (finalTotal: number) => void;
}

const OrderSummary = ({
  subtotal,
  deliveryFee,
  total,
  cartItems,
  unavailableItems = [],
  onPlaceOrder,
  isPlacingOrder = false,
  isEstimatingDelivery = false,
  couponCode,
  setCouponCode,
  onCouponApplied,
}: OrderSummaryProps) => {
  const { currency } = useCLC();
  const t = useTranslations("Checkout");
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(
    null,
  );

  const displayTotal = appliedCoupon
    ? appliedCoupon.finalTotal + deliveryFee
    : total;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t("couponEmptyError"));
      return;
    }
    setIsApplying(true);
    try {
      const res = await validateCouponAction(couponCode.trim(), subtotal);
      if (res.success && res.data?.valid) {
        const coupon: AppliedCoupon = {
          couponCode: res.data.couponCode,
          discountAmount: res.data.discountAmount,
          finalTotal: res.data.finalTotal,
        };
        setAppliedCoupon(coupon);
        onCouponApplied?.(coupon.finalTotal + deliveryFee);
        toast.success(t("couponAppliedToast"));
      } else {
        toast.error(res.message || t("couponInvalid"));
      }
    } catch {
      toast.error(t("couponValidateFailed"));
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    onCouponApplied?.(total);
  };

  return (
    <div className="space-y-6">
      {/* Delivery Time Estimate */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Clock size={20} />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            {t("estDeliveryTime")}
          </p>
          <p className="font-bold text-gray-900">{t("estDeliveryTimeValue")}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-lg mb-1">{t("yourItems")}</h3>
        <p className="text-sm text-gray-500 mb-6">
          {t("fromRestaurant", {
            name: cartItems[0]?.restaurantName || t("restaurantFallback"),
          })}
        </p>

        <div className="space-y-4 mb-6">
          {(Array.isArray(cartItems) ? cartItems : []).map((item) => {
            const discountAmount = item.discount
              ? parseFloat(item.discount)
              : 0;
            const hasDiscount =
              discountAmount > 0 &&
              item.originalPrice != null &&
              item.originalPrice > (item.price || 0);

            return (
              <div
                key={item.cartId || item.id}
                className="flex justify-between items-start text-sm"
              >
                <div className="flex gap-2">
                  <span className="font-bold text-primary">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {Array.isArray(item.selectedVariations) &&
                      item.selectedVariations.length > 0 && (
                        <p className="text-xs text-gray-500">
                          {item.selectedVariations
                            .map((v) => v.name)
                            .join(", ")}
                        </p>
                      )}
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          {currency}
                          {item.originalPrice!.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {currency}
                        {(item.price || 0).toFixed(2)} x {item.quantity}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">
                          -{currency}
                          {discountAmount.toFixed(0)} {t("itemOff")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-medium text-gray-900 whitespace-nowrap ml-2">
                  {currency}
                  {((item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Unavailable items from a reorder — display only, excluded from
        subtotal/total and never sent to checkout */}
        {unavailableItems.length > 0 && (
          <div className="space-y-3 mb-6 pt-4 border-t border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {t("unavailableItemsTitle")}
            </p>
            {unavailableItems.map((item) => (
              <div
                key={item.cartId || item.id}
                className="flex justify-between items-start text-sm opacity-50"
              >
                <div className="flex gap-2">
                  <span className="font-bold text-gray-400">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-medium text-gray-500 line-through">
                      {item.name}
                    </p>
                    {Array.isArray(item.selectedVariations) &&
                      item.selectedVariations.length > 0 && (
                        <p className="text-xs text-gray-400">
                          {item.selectedVariations
                            .map((v) => v.name)
                            .join(", ")}
                        </p>
                      )}
                  </div>
                </div>
                <span className="font-medium text-gray-400 whitespace-nowrap ml-2">
                  {currency}
                  {((item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-400">
              {t("unavailableItemsNote")}
            </p>
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-4">
          <div className="flex justify-between text-gray-500">
            <span>{t("subtotal")}</span>
            <span>
              {currency}
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>{t("deliveryFee")}</span>
            <span>
              {isEstimatingDelivery ? (
                <Loader2 size={14} className="animate-spin inline" />
              ) : (
                `${currency}${deliveryFee.toFixed(2)}`
              )}
            </span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-forest-green font-medium">
              <span>
                {t("discountLabel", { code: appliedCoupon.couponCode })}
              </span>
              <span>
                - {currency}
                {appliedCoupon.discountAmount.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 mb-6">
          <span className="font-bold text-lg">{t("total")}</span>
          <div className="text-right">
            {appliedCoupon && (
              <span className="text-gray-400 line-through text-sm mr-2">
                {currency}
                {total.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-2xl text-primary">
              {currency}
              {displayTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Promo Code */}
        {appliedCoupon ? (
          <div className="flex items-center justify-between mb-6 bg-forest-green/10 border border-forest-green/30 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2 text-forest-green text-sm font-medium">
              <Tag size={16} />
              <span>
                {t("couponApplied", { code: appliedCoupon.couponCode })}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-lg">
            <div className="flex items-center gap-2 px-2 text-gray-400">
              <Tag size={18} />
            </div>
            <input
              type="text"
              placeholder={t("promoPlaceholder")}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              className="bg-transparent border-none text-sm outline-none w-full font-sans uppercase placeholder:normal-case"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="text-xs font-bold text-primary px-3 hover:underline disabled:opacity-50"
            >
              {isApplying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                t("applyBtn")
              )}
            </button>
          </div>
        )}

        <Button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className="w-full h-12 bg-primary hover:bg-[#e85a2a] text-white font-bold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            t("placeOrderBtn")
          )}
        </Button>

        <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight">
          {t("agreeToOrderPrefix")}{" "}
          <Link href="/terms-of-service" className="underline cursor-pointer">
            {t("termsAndConditions")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
