"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, Tag, Check, Copy } from "lucide-react";
import { GlobalModal } from "@/components/common/GlobalModal";
import { useCLC } from "@/context/CLCContext";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";

export interface Coupon {
  code: string;
  discountType: "percentage" | "fixed" | string;
  discountValue: number;
  minOrder?: number;
  maxOrderCap?: number;
  expiresAt?: string;
  status?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  startTime: string;
  endTime: string;
  coupon?: Coupon;
}

interface PromotionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaigns: Campaign[];
}

export function PromotionsModal({
  open,
  onOpenChange,
  campaigns,
}: PromotionsModalProps) {
  const t = useTranslations("Discovery.promotionsModal");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const { formatPrice, currencyCode } = useCLC();

  if (!campaigns || campaigns.length === 0) return null;

  const currentCampaign = campaigns[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length);
    setCopied(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? campaigns.length - 1 : prevIndex - 1
    );
    setCopied(false);
  };

  const getImageUrl = (imagePath: string) => imagePath || "";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  const formatCouponValue = (value: number) => {
    const isCentsCurrency = ["USD", "EUR", "GBP", "CAD", "AUD"].includes(currencyCode.toUpperCase());
    if (isCentsCurrency && value >= 1000) {
      return formatPrice(value / 100);
    }
    return formatPrice(value);
  };

  const handleCopy = () => {
    if (currentCampaign.coupon?.code) {
      navigator.clipboard.writeText(currentCampaign.coupon.code);
      setCopied(true);
      toast.success(t("couponCopied"));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <GlobalModal
      open={open}
      onOpenChange={onOpenChange}
      customStyle={true}
      className="max-w-[480px] p-0 overflow-hidden bg-white rounded-3xl shadow-2xl border border-gray-100"
    >
      {/* Campaign Visual Header */}
      <div className="relative w-full h-[220px] bg-gray-100 flex items-center justify-center overflow-hidden">
        {currentCampaign.image ? (
          <Image
            src={getImageUrl(currentCampaign.image)}
            alt={currentCampaign.title}
            fill
            sizes="(max-w-md) 100vw, 480px"
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <Tag className="w-12 h-12 text-[#346853] opacity-60" />
            <span className="text-sm font-medium">{t("specialPromotion")}</span>
          </div>
        )}

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Promotion tag badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#346853] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md tracking-wide">
          <Tag className="w-3.5 h-3.5" />
          <span>{t("promotionBadge")}</span>
        </div>

        {/* Campaign Title Overlay */}
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h2 className="text-2xl font-bold tracking-tight line-clamp-1 drop-shadow-md">
            {currentCampaign.title}
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col gap-4">
        {/* Date / Validity Area */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-3.5 py-2.5 rounded-2xl w-full border border-gray-100">
          <Calendar className="w-4 h-4 text-[#346853] shrink-0" />
          <span className="truncate">
            {t("validRange", { start: formatDate(currentCampaign.startTime), end: formatDate(currentCampaign.endTime) })}
          </span>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-600 leading-relaxed break-words line-clamp-3">
            {currentCampaign.description}
          </p>
        </div>

        {/* Coupon Section */}
        {currentCampaign.coupon && (
          <div className="relative mt-2 border-2 border-dashed border-[#82A896]/50 bg-[#F4FBF7] rounded-2xl p-4 flex flex-col gap-3 shadow-sm overflow-hidden select-none">
            {/* Left & Right Decorative Punch-out Holes */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-r border-gray-100 shrink-0" />
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-l border-gray-100 shrink-0" />

            <div className="flex items-start justify-between gap-3 px-2">
              <div>
                <span className="text-xs font-bold text-[#346853] uppercase tracking-wider bg-[#E8F5F0] px-2.5 py-1 rounded-md">
                  {currentCampaign.coupon.discountType === "percentage"
                    ? `${currentCampaign.coupon.discountValue}% OFF`
                    : `${formatCouponValue(currentCampaign.coupon.discountValue)} OFF`}
                </span>
                <h3 className="font-bold text-gray-900 text-sm mt-2">
                  {currentCampaign.coupon.discountType === "percentage"
                    ? t("percentageDiscount", { value: currentCampaign.coupon.discountValue })
                    : t("flatDiscount", { value: formatCouponValue(currentCampaign.coupon.discountValue) })}
                </h3>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
                  {currentCampaign.coupon.minOrder && (
                    <span>
                      {t("minOrder")} <strong className="text-gray-700">{formatCouponValue(currentCampaign.coupon.minOrder)}</strong>
                    </span>
                  )}
                  {currentCampaign.coupon.maxOrderCap && (
                    <span>
                      {t("maxCap")} <strong className="text-gray-700">{formatCouponValue(currentCampaign.coupon.maxOrderCap)}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Coupon Code Copy Action Row */}
            <div className="flex items-center gap-2 mt-1 bg-white p-2 rounded-xl border border-[#82A896]/20">
              <div className="flex-1 font-mono text-center font-bold text-gray-800 tracking-wider text-sm select-all">
                {currentCampaign.coupon.code}
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 bg-[#346853] hover:bg-[#28503f] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold active:scale-[0.98] transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t("copied")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t("copy")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Multi-campaign Slider Controls */}
        {campaigns.length > 1 && (
          <div className="flex items-center justify-between border-t border-b border-gray-50 py-3 mt-1">
            <button
              onClick={handlePrev}
              aria-label="Previous promotion"
              className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {campaigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to promotion ${index + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-[#346853] w-6"
                    : "bg-gray-200 hover:bg-gray-300"
                    }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next promotion"
              className="p-1.5 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:scale-105 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#346853] hover:bg-[#28503f] active:scale-[0.99] text-white font-semibold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>{t("exploreDeals")}</span>
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-2xl transition-all text-sm text-center"
          >
            {t("dismiss")}
          </button>
        </div>
      </div>
    </GlobalModal>
  );
}
