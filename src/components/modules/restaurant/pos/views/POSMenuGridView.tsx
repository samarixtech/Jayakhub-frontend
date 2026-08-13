"use client";

import Image from "next/image";
import { usePOS } from "@/context/POSContext";
import { useCLC } from "@/context/CLCContext";
import { Plus, Tag, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { AppDispatch, RootState } from "@/redux/store/store";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export default function POSMenuGrid() {
  const t = useTranslations("POS.menuGrid");
  const {
    posItems,
    posDeals,
    isPosLoading,
    setIsCartOpen,
    selectedTable,
    activeCategory,
    searchTerm,
  } = usePOS();
  const { formatPrice } = useCLC();
  const dispatch = useDispatch<AppDispatch>();
  const { orderType, pendingOrders } = useSelector(
    (state: RootState) => state.cart,
  );

  // Helper for Table validation before adding to cart
  const validateTableSelection = () => {
    if (orderType === "Dine-In") {
      if (!selectedTable) {
        toast.error(t("selectTableFirst"));
        return false;
      }

      const isTablePending = pendingOrders.some(
        (order) => order.tableName === selectedTable.name,
      );

      if (isTablePending) {
        toast.error(t("tablePending", { table: selectedTable.name }));
        return false;
      }

      if (
        selectedTable.status === "Pay Pending" ||
        selectedTable.status === "Occupied"
      ) {
        toast.error(t("tableNotAvailable", { table: selectedTable.name }));
        return false;
      }
    }
    return true;
  };

  // Filter items and deals based on activeCategory & searchTerm
  const searchLower = (searchTerm || "").toLowerCase().trim();

  const filteredDeals = (posDeals || []).filter((deal) => {
    if (activeCategory !== "all" && activeCategory !== "Deals") return false;
    if (!searchLower) return true;
    const titleMatch = deal.title?.toLowerCase().includes(searchLower);
    const descMatch = deal.description?.toLowerCase().includes(searchLower);
    return titleMatch || descMatch;
  });

  const filteredItems = (posItems || []).filter((item) => {
    if (activeCategory === "Deals") return false;
    if (!searchLower) return true;
    const nameMatch = item.name?.toLowerCase().includes(searchLower);
    const descMatch = item.description?.toLowerCase().includes(searchLower);
    return nameMatch || descMatch;
  });

  if (isPosLoading) {
    return (
      <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 overflow-y-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[10px] overflow-hidden flex flex-col h-[150px]"
            >
              <Skeleton className="h-[90px] md:h-[100px] w-full rounded-none" />
              <div className="p-2 sm:p-2.5 flex flex-col gap-2">
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-1/3 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const hasDeals = filteredDeals.length > 0;
  const hasItems = filteredItems.length > 0;

  if (!hasDeals && !hasItems) {
    return (
      <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 flex flex-col items-center justify-center w-full text-gray-400">
        <p className="text-sm font-medium">{t("noItems")}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 overflow-y-auto w-full space-y-5">
      {/* DEALS SECTION (if present in "all" or "Deals" view) */}
      {hasDeals && (
        <div>
          {activeCategory === "all" && (
            <div className="flex items-center gap-2 mb-2.5">
              <Tag className="w-4 h-4 text-[#FF6B35]" />
              <h2 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                Deals & Special Offers
              </h2>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {filteredDeals.map((deal) => {
              const apiOrig = Number(deal.originalAmount || 0);
              const apiFinal = Number(deal.finalAmount || 0);

              const discountAmt = deal.discountValue
                ? parseFloat(deal.discountValue)
                : 0;
              const originalSum =
                apiOrig > 0
                  ? apiOrig
                  : deal.items?.reduce(
                      (sum: number, di: any) =>
                        sum + (Number(di.item?.basePrice) || 0),
                      0,
                    ) || 0;

              let effectivePrice = apiFinal > 0 ? apiFinal : originalSum;
              if (apiFinal <= 0) {
                if (deal.discountType === "fixed" && discountAmt > 0) {
                  effectivePrice =
                    originalSum > 0
                      ? Math.max(0, originalSum - discountAmt)
                      : discountAmt;
                } else if (deal.discountType === "percentage" && discountAmt > 0) {
                  effectivePrice =
                    originalSum > 0
                      ? Math.max(0, originalSum - (originalSum * discountAmt) / 100)
                      : discountAmt;
                } else if (effectivePrice === 0 && discountAmt > 0) {
                  effectivePrice = discountAmt;
                }
              }

              const badgeText = deal.badge || "COMBO DEAL";

              return (
                <div
                  key={deal.id}
                  onClick={() => {
                    if (!validateTableSelection()) return;

                    dispatch(
                      addToCart({
                        id: deal.id,
                        name: deal.title,
                        description: deal.description || "",
                        price: effectivePrice,
                        basePrice: originalSum || effectivePrice,
                        discount: deal.discountValue
                          ? String(deal.discountValue)
                          : undefined,
                        quantity: 1,
                        image: deal.image || "",
                        isDeal: true,
                        dealItems: deal.items || [],
                        dealData: deal,
                        cashierItemId: deal.id,
                        tableName: selectedTable?.name || "Table",
                        orderType: orderType,
                        paymentMethod: "Cash",
                      }),
                    );
                    if (window.innerWidth < 1024) {
                      setIsCartOpen(true);
                    }
                  }}
                  className="group bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-orange-200 overflow-hidden cursor-pointer flex flex-col hover:shadow-md hover:border-[#FF6B35]/50 transition-all active:scale-95 duration-200 relative"
                >
                  {/* Badge */}
                  <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full z-10 shadow-sm flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" />
                    {badgeText}
                  </div>

                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-[#FF6B35] shadow-sm">
                    <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>

                  <div className="h-[90px] md:h-[100px] w-full relative bg-gray-100 overflow-hidden flex items-center justify-center">
                    {deal.image ? (
                      <Image
                        src={deal.image}
                        alt={deal.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <UtensilsCrossed className="w-7 h-7 text-orange-400" />
                      </div>
                    )}
                  </div>

                  <div className="p-2 sm:p-2.5 flex flex-col gap-0.5">
                    <h3 className="text-[11px] sm:text-[12px] font-extrabold text-[#333] leading-snug truncate group-hover:text-[#FF6B35] transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 truncate">
                      {deal.description || `${deal.items?.length || 0} items included`}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                      <span className="text-[#FF6B35] font-black text-[11px] sm:text-[12px]">
                        {formatPrice(effectivePrice)}
                      </span>
                      {originalSum > effectivePrice && (
                        <span className="text-gray-400 font-medium text-[10px] line-through">
                          {formatPrice(originalSum)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* REGULAR ITEMS SECTION */}
      {hasItems && (
        <div>
          {activeCategory === "all" && hasDeals && (
            <div className="flex items-center gap-2 mb-2.5 mt-2">
              <h2 className="text-xs font-black uppercase text-gray-700 tracking-wider">
                Menu Items
              </h2>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
            {filteredItems.map((item) => {
              const imageUrl = item.image;
              const discountAmt = item.discount ? parseFloat(item.discount) : 0;
              const effectivePrice = Number(item.basePrice) - discountAmt;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (!validateTableSelection()) return;

                    dispatch(
                      addToCart({
                        id: item.id,
                        name: item.name,
                        description: item.description || "",
                        price: effectivePrice,
                        basePrice: Number(item.basePrice),
                        discount: item.discount,
                        quantity: 1,
                        image: imageUrl,
                        variations: item.variations || [],
                        cashierItemId: item.id,
                        tableName: selectedTable?.name || "Table",
                        orderType: orderType,
                        paymentMethod: "Cash",
                      }),
                    );
                    if (window.innerWidth < 1024) {
                      setIsCartOpen(true);
                    }
                  }}
                  className="group bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden cursor-pointer flex flex-col hover:shadow-md hover:border-[#FF6B35]/30 transition-all active:scale-95 duration-200 relative"
                >
                  {/* Discount badge */}
                  {discountAmt > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full z-10">
                      -{formatPrice(discountAmt)}
                    </div>
                  )}

                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-[#FF6B35] shadow-sm">
                    <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                  </div>

                  <div className="h-[90px] md:h-[100px] w-full relative bg-gray-100 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="p-2 sm:p-2.5 flex flex-col gap-0.5">
                    <h3 className="text-[11px] sm:text-[12px] font-extrabold text-[#333] leading-snug truncate group-hover:text-[#FF6B35] transition-colors">
                      {item.name}
                    </h3>
                    {discountAmt > 0 ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[#FF6B35] font-black text-[11px] sm:text-[12px]">
                          {formatPrice(effectivePrice)}
                        </span>
                        <span className="text-gray-400 font-medium text-[10px] line-through">
                          {formatPrice(item.basePrice)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[#FF6B35] font-black text-[11px] sm:text-[12px]">
                        {formatPrice(item.basePrice)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
