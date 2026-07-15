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
  onPlaceOrder?: () => void;
  isPlacingOrder?: boolean;
  couponCode: string;
  setCouponCode: (val: string) => void;
  onCouponApplied?: (finalTotal: number) => void;
}

const OrderSummary = ({
  subtotal,
  deliveryFee,
  total,
  cartItems,
  onPlaceOrder,
  isPlacingOrder = false,
  couponCode,
  setCouponCode,
  onCouponApplied,
}: OrderSummaryProps) => {
  const { currency } = useCLC();
  const t = useTranslations("Checkout");
  const [isApplying, setIsApplying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const displayTotal = appliedCoupon ? appliedCoupon.finalTotal : total;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t("couponEmptyError"));
      return;
    }
    setIsApplying(true);
    try {
      const res = await validateCouponAction(couponCode.trim(), total);
      if (res.success && res.data?.valid) {
        const coupon: AppliedCoupon = {
          couponCode: res.data.couponCode,
          discountAmount: res.data.discountAmount,
          finalTotal: res.data.finalTotal,
        };
        setAppliedCoupon(coupon);
        onCouponApplied?.(coupon.finalTotal);
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
        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-[#346853]">
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
          {t("fromRestaurant", { name: cartItems[0]?.restaurantName || t("restaurantFallback") })}
        </p>

        <div className="space-y-4 mb-6">
          {(cartItems || []).map((item) => (
            <div
              key={item.cartId || item.id}
              className="flex justify-between items-start text-sm"
            >
              <div className="flex gap-2">
                <span className="font-bold text-[#346853]">{item.quantity}x</span>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  {item.selectedVariations && item.selectedVariations.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {item.selectedVariations.map((v) => v.name).join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <span className="font-medium text-gray-900">
                {currency}{((item.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-2 text-sm border-t border-gray-100 pt-4 mb-4">
          <div className="flex justify-between text-gray-500">
            <span>{t("subtotal")}</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>{t("deliveryFee")}</span>
            <span>{currency}{deliveryFee.toFixed(2)}</span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>{t("discountLabel", { code: appliedCoupon.couponCode })}</span>
              <span>- {currency}{appliedCoupon.discountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-2 mb-6">
          <span className="font-bold text-lg">{t("total")}</span>
          <div className="text-right">
            {appliedCoupon && (
              <span className="text-gray-400 line-through text-sm mr-2">
                {currency}{total.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-2xl text-[#346853]">
              {currency}{displayTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Promo Code */}
        {appliedCoupon ? (
          <div className="flex items-center justify-between mb-6 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
              <Tag size={16} />
              <span>{t("couponApplied", { code: appliedCoupon.couponCode })}</span>
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
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              className="bg-transparent border-none text-sm outline-none w-full font-sans"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="text-xs font-bold text-[#346853] px-3 hover:underline disabled:opacity-50"
            >
              {isApplying ? <Loader2 size={14} className="animate-spin" /> : t("applyBtn")}
            </button>
          </div>
        )}

        <Button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder}
          className="w-full h-12 bg-[#346853] hover:bg-[#2a5443] text-white font-bold rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPlacingOrder ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            t("placeOrderBtn")
          )}
        </Button>

        <p className="text-[10px] text-gray-400 text-center mt-3 leading-tight">
          {t("agreeToOrderPrefix")}{" "}
          <Link href="/terms-of-service" className="underline cursor-pointer">{t("termsAndConditions")}</Link>.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
