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

interface DealCardProps {
  deal: PublicDeal;
  onClick: () => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
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

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer min-w-[260px] w-[260px] rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
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

        {itemCount > 0 && (
          <p className="text-[11px] text-orange-600 font-semibold mt-1.5">
            {t("itemsIncluded", { count: itemCount })}
          </p>
        )}
      </div>
    </div>
  );
};

export const DealsSection: React.FC<DealsSectionProps> = ({
  isDealsLoading,
  deals,
  onDealClick,
}) => {
  const t = useTranslations("Discovery.dealsSection");

  if (!isDealsLoading && (!deals || deals.length === 0)) {
    return null;
  }

  return (
    <section className="mb-4">
      <SectionHeader title={t("title")} />
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
