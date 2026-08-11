import React from "react";
import { Utensils, Tag } from "lucide-react";
import { useCLC } from "@/context/CLCContext";
import { useTranslations } from "next-intl";

interface Coupon {
  code: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface OrderSummaryTableProps {
  items: any[];
  deals?: any[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  coupon?: Coupon | null;
}

export const OrderSummaryTable: React.FC<OrderSummaryTableProps> = ({
  items,
  deals = [],
  subtotal,
  deliveryFee,
  total,
  coupon,
}) => {
  const { formatPrice } = useCLC();
  const t = useTranslations("OrderTracking");

  // Collect all item IDs that belong to deals
  const dealItemIds = new Set<string>();

  if (deals && deals.length > 0) {
    deals.forEach((deal: any) => {
      if (Array.isArray(deal.items)) {
        deal.items.forEach((di: any) => {
          if (di.itemId) dealItemIds.add(String(di.itemId));
          if (di.id) dealItemIds.add(String(di.id));
        });
      }
    });
  }

  // Filter out items that explicitly belong to a deal
  const standaloneItems = (items || []).filter((item: any) => {
    if (item.dealId) return false;
    if (item.isDealItem) return false;
    if (item.parentDealId) return false;

    // If an item has price 0 and matches a deal item ID, it's a nested deal item
    const idToCheck = String(item.itemId || item.id || item.orderItemId || "");
    if ((!item.price || Number(item.price) === 0) && idToCheck && dealItemIds.has(idToCheck)) {
      return false;
    }

    return true;
  });

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex items-center gap-2 mb-6">
        <Utensils className="w-4 h-4 text-navy" />
        <h3 className="font-bold text-gray-900">{t("orderSummary")}</h3>
      </div>

      <div className="space-y-4 mb-6">
        {/* Render Deals with nested items */}
        {deals &&
          deals.map((deal: any, idx: number) => {
            const dealPrice =
              deal.price ?? deal.dealPrice ?? deal.totalPrice ?? deal.amount ?? 0;
            const originalPrice = deal.originalPrice ? Number(deal.originalPrice) : 0;
            const hasDealPrice = dealPrice > 0;
            const hasOriginalPrice = originalPrice > dealPrice;

            return (
              <div
                key={`deal-${idx}`}
                className="bg-orange-50/50 border border-orange-100 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-1 gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0 border border-orange-200 text-brand-orange">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">
                          {deal.quantity || 1}x
                        </span>
                        <span className="font-bold text-gray-900 text-sm">
                          {deal.title || deal.name}
                        </span>
                        <span className="text-[10px] font-bold bg-brand-orange text-white px-2 py-0.5 rounded-full">
                          Combo Deal
                        </span>
                      </div>
                      {deal.discountAmount ? (
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          Discount: {formatPrice(deal.discountAmount)} off
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 ml-3">
                    {hasOriginalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(originalPrice * (deal.quantity || 1))}
                      </span>
                    )}
                    {hasDealPrice && (
                      <span className="font-bold text-brand-orange text-base">
                        {formatPrice(dealPrice * (deal.quantity || 1))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items within the deal */}
                {deal.items && deal.items.length > 0 && (
                  <div className="pt-2 border-t border-orange-200/60">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Included Items:
                    </p>
                    <div className="space-y-1.5">
                      {deal.items.map((subItem: any, sIdx: number) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between gap-2 text-xs text-gray-700 bg-white/80 p-1.5 rounded-md border border-orange-100/60"
                        >
                          <div className="flex items-center gap-2">
                            {subItem.image ? (
                              <img
                                src={subItem.image}
                                alt={subItem.name}
                                className="w-6 h-6 rounded object-cover shrink-0 border border-gray-200"
                              />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 ml-1" />
                            )}
                            <span className="font-semibold text-gray-800">
                              {subItem.quantity ? `${subItem.quantity}x ` : ""}
                              {subItem.name}
                            </span>
                          </div>
                          {subItem.price != null && Number(subItem.price) > 0 && (
                            <span className="text-xs text-gray-500 font-medium">
                              {formatPrice(Number(subItem.price))}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {/* Render Standalone Items */}
        {standaloneItems &&
          standaloneItems.map((item: any, idx: number) => {
            const imageUrl = item.image || null;
            const discountAmount = item.discount ? parseFloat(item.discount) : 0;
            const hasDiscount =
              discountAmount > 0 &&
              item.originalPrice != null &&
              item.originalPrice > (item.price || 0);

            return (
              <div key={idx} className="flex justify-between items-start">
                <div className="flex flex-1 gap-3">
                  {/* Image */}
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Utensils className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-900">
                        {item.quantity}x
                      </span>
                      <span className="font-bold text-gray-900">
                        {item.name}
                      </span>
                    </div>
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      {hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatPrice(item.price)} x {item.quantity}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md">
                          -{formatPrice(discountAmount)} {t("itemOff")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-bold text-primary shrink-0 ml-4">
                  {formatPrice((item.price || 0) * item.quantity)}
                </span>
              </div>
            );
          })}
      </div>

      <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-4">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>{t("subtotal")}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>{t("deliveryFee")}</span>
          <span className={deliveryFee === 0 ? "text-forest-green font-medium" : ""}>
            {deliveryFee === 0 ? t("free") : formatPrice(deliveryFee)}
          </span>
        </div>
        {coupon && (
          <div className="flex justify-between text-forest-green text-sm font-medium">
            <span className="flex items-center gap-1">
              {t("coupon")}
              <span className="bg-forest-green/10 border border-forest-green/30 text-forest-green text-[10px] font-bold px-1.5 py-0.5 rounded">
                {coupon.code}
              </span>
              <span className="text-gray-400 text-xs font-normal">
                ({coupon.discountType === "percentage" ? `${coupon.discountValue}%` : formatPrice(coupon.discountValue)} off)
              </span>
            </span>
            <span>- {formatPrice(coupon.discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end border-t border-gray-100 pt-4">
        <span className="font-bold text-lg text-gray-900">{t("total")}</span>
        <span className="font-bold text-xl text-gray-900">
          {formatPrice(total)}
        </span>
      </div>
    </div>
  );
};
