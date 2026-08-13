import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Tag, UtensilsCrossed } from "lucide-react";
import SectionHeader from "@/components/modules/discovery/components/SectionHeader";
import { useCLC } from "@/context/CLCContext";
import {
  DealsSectionProps,
  PublicDeal,
} from "@/components/modules/discovery/discovery.types";

export interface DealCardProps {
  deal: PublicDeal;
  onClick: () => void;
  className?: string;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick, className }) => {
  const t = useTranslations("Discovery.dealsSection");
  const { formatPrice } = useCLC();
  const [imgError, setImgError] = React.useState(false);
  const hasValidImage = Boolean(deal.image) && !imgError;
  const discountValue = Number(deal.discountValue || 0);

  const discountLabel =
    deal.discountType === "percentage"
      ? t("percentOff", { value: discountValue })
      : t("saveAmount", { amount: formatPrice(discountValue) });

  const itemCount = deal.items?.length || 0;

  const rawFinal = Number(deal.finalAmount ?? deal.dealPrice ?? deal.price ?? 0);
  const rawOrig = Number(deal.originalAmount ?? 0);
  let finalPrice = rawFinal;
  let origPrice = rawOrig;

  if (finalPrice <= 0 && origPrice > 0 && discountValue > 0) {
    if (deal.discountType === "percentage") {
      finalPrice = Math.max(0, origPrice * (1 - discountValue / 100));
    } else {
      finalPrice = Math.max(0, origPrice - discountValue);
    }
  }

  const hasPrice = finalPrice > 0;

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${
        className || "min-w-[260px] w-[260px]"
      }`}
    >
      <div className="relative h-32 w-full bg-gray-100 overflow-hidden">
        {hasValidImage ? (
          <Image
            fill
            src={deal.image as string}
            alt={deal.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20">
            <UtensilsCrossed className="w-8 h-8 text-orange-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {discountLabel}
        </span>

        {deal.badge && (
          <span className="absolute top-2 left-2 bg-brand-orange text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full shadow-sm">
            {deal.badge}
          </span>
        )}
      </div>

      <div className="p-3">
        {deal.restaurant?.name && (
          <div className="flex items-center gap-1.5 mb-1 min-w-0">
            {deal.restaurant?.profileImage && (
              <span className="relative w-4 h-4 rounded-full overflow-hidden shrink-0 inline-block">
                <Image
                  fill
                  src={deal.restaurant.profileImage}
                  alt={deal.restaurant.name}
                  className="object-cover"
                />
              </span>
            )}
            <span className="text-[11px] text-gray-500 font-medium truncate">
              {deal.restaurant.name}
            </span>
          </div>
        )}

        <h4 className="font-bold text-sm text-gray-900 truncate">
          {deal.title}
        </h4>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
          {deal.description}
        </p>

        {/* Price & Items Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          {hasPrice ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-extrabold text-brand-orange">
                {formatPrice(finalPrice)}
              </span>
              {origPrice > finalPrice && (
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrice(origPrice)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs font-bold text-brand-orange">
              {deal.discountType === "percentage"
                ? `${discountValue}% OFF`
                : `${formatPrice(discountValue)} OFF`}
            </span>
          )}

          {itemCount > 0 && (
            <span className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              {t("itemsIncluded", { count: itemCount })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const DealsSection: React.FC<DealsSectionProps> = ({
  isDealsLoading,
  deals,
  onDealClick,
  onSeeAll,
}) => {
  const t = useTranslations("Discovery.dealsSection");

  if (!isDealsLoading && (!deals || deals.length === 0)) {
    return null;
  }

  return (
    <section className="mb-4">
      <SectionHeader
        title={t("title")}
        actionText={t("seeAll")}
        onAction={onSeeAll}
      />
      {isDealsLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="min-w-[260px] h-[190px] bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {(deals || []).map((deal) => (
            <DealCard key={deal.id} deal={deal} onClick={() => onDealClick(deal)} />
          ))}
        </div>
      )}
    </section>
  );
};
