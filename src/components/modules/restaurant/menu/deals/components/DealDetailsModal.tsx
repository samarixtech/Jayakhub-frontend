"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  Tag,
  CheckCircle2,
  XCircle,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";
import { getDealDetailsAction } from "@/app/actions/restaurant/menu";
import { useCLC } from "@/context/CLCContext";

interface DealDetailsModalProps {
  dealId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DealDetailsModal({
  dealId,
  open,
  onOpenChange,
}: DealDetailsModalProps) {
  const { formatPrice } = useCLC();
  const t = useTranslations("RestaurantDashboard.Deals");
  const [loading, setLoading] = useState(false);
  const [deal, setDeal] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!open || !dealId) {
      setDeal(null);
      setError(null);
      setImgError(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setImgError(false);

    async function fetchDetails() {
      try {
        const res = await getDealDetailsAction(dealId!);
        if (!isMounted) return;

        if (res.success && res.data) {
          setDeal(res.data);
        } else {
          setError(res.message || t("detailsModal.loadFailed"));
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || t("detailsModal.loadError"));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [dealId, open]);

  // Compute calculated total prices for display
  const items = deal?.items || [];
  const originalTotalPrice = items.reduce(
    (sum: number, di: any) => sum + Number(di.item?.basePrice || 0),
    0,
  );

  const discountVal = Number(deal?.discountValue || 0);
  const discountType = deal?.discountType || "fixed";
  const calculatedDiscount =
    discountType === "fixed"
      ? discountVal
      : originalTotalPrice > 0
        ? (originalTotalPrice * discountVal) / 100
        : 0;

  const finalComboPrice = Math.max(0, originalTotalPrice - calculatedDiscount);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return t("common.notAvailable");
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-none shadow-2xl bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {deal?.title
              ? `${deal.title} ${t("detailsModal.titleSuffix")}`
              : t("detailsModal.defaultTitle")}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
            <Typography className="text-sm font-semibold text-gray-600">
              {t("detailsModal.loading")}
            </Typography>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6" />
            </div>
            <Typography className="text-base font-bold text-gray-900">
              {t("detailsModal.errorTitle")}
            </Typography>
            <Typography className="text-xs text-gray-500 max-w-sm mx-auto">
              {error}
            </Typography>
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gray-900 text-white text-xs px-4 py-2 rounded-xl"
            >
              {t("detailsModal.close")}
            </Button>
          </div>
        ) : deal ? (
          <div className="space-y-0">
            {/* Header Image & Cover */}
            <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
              {deal.image && !imgError ? (
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/20">
                  <UtensilsCrossed className="w-12 h-12 text-orange-400 mb-2" />
                  <Typography className="text-xs font-semibold text-gray-500">
                    {t("detailsModal.comboDealImage")}
                  </Typography>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    deal.isActive
                      ? "bg-emerald-500 text-white font-bold text-xs uppercase shadow-sm"
                      : "bg-gray-400 text-white font-bold text-xs uppercase shadow-sm"
                  }
                >
                  {deal.isActive ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t("status.active")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> {t("status.inactive")}
                    </span>
                  )}
                </Badge>

                {deal.badge && (
                  <Badge className="bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {deal.badge}
                  </Badge>
                )}

                <Badge className="bg-black/50 backdrop-blur-md text-white font-medium text-xs uppercase">
                  {deal.dealType || t("detailsModal.comboFallback")}
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <Typography className="text-xl sm:text-2xl font-extrabold line-clamp-1 drop-shadow-md">
                  {deal.title}
                </Typography>
                {deal.description && (
                  <Typography className="text-xs text-gray-200 line-clamp-2 mt-0.5 opacity-90">
                    {deal.description}
                  </Typography>
                )}
              </div>
            </div>

            {/* Details Content Container */}
            <div className="p-6 space-y-6 bg-white">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-orange-50/70 border border-orange-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                    {t("card.comboPrice")}
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-lg font-extrabold text-gray-900">
                      {formatPrice(finalComboPrice)}
                    </span>
                    {originalTotalPrice > finalComboPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(originalTotalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-red-50/70 border border-red-100 p-3 rounded-2xl">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                    {t("detailsModal.discountSaved")}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Tag className="w-4 h-4 text-red-500" />
                    <span className="text-base font-extrabold text-red-600">
                      {discountType === "fixed"
                        ? formatPrice(discountVal)
                        : t("detailsModal.percentOff", { value: discountVal })}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-2xl col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                    {t("detailsModal.validityWindow")}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>
                      {formatDate(deal.startDate)} - {formatDate(deal.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Included Items Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-brand-orange" />
                    {t("detailsModal.includedItems", { count: items.length })}
                  </h4>
                  <span className="text-xs text-gray-400 font-medium">
                    {t("detailsModal.originalSubtotal", {
                      amount: formatPrice(originalTotalPrice),
                    })}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {items.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      {t("detailsModal.noItems")}
                    </p>
                  ) : (
                    items.map((di: any) => {
                      const itemObj = di.item || {};
                      return (
                        <div
                          key={di.id || di.itemId}
                          className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200/60">
                            {itemObj.image ? (
                              <Image
                                src={itemObj.image}
                                alt={itemObj.name || t("common.itemFallback")}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <UtensilsCrossed className="w-5 h-5" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-sm text-gray-900 truncate">
                                {itemObj.name || t("detailsModal.unnamedItem")}
                              </h5>
                              {itemObj.dietaryType && (
                                <Badge className="text-[9px] font-semibold bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-1.5 py-0">
                                  {itemObj.dietaryType}
                                </Badge>
                              )}
                            </div>
                            {itemObj.description && (
                              <p className="text-xs text-gray-500 truncate mt-0.5">
                                {itemObj.description}
                              </p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-sm font-bold text-gray-900 block">
                              {formatPrice(itemObj.basePrice || 0)}
                            </span>
                            {itemObj.isAvailable !== false ? (
                              <span className="text-[10px] text-emerald-600 font-semibold">
                                {t("detailsModal.available")}
                              </span>
                            ) : (
                              <span className="text-[10px] text-red-500 font-semibold">
                                {t("detailsModal.unavailable")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Close Action Button */}
              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => onOpenChange(false)}
                  className="bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold px-6 py-2.5 cursor-pointer shadow-sm"
                >
                  {t("detailsModal.closeDetails")}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
