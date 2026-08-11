"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Check,
  Smartphone,
  Loader2,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import { DealCombo, MenuItemOption, DealItemSelection } from "../types/deals";
import { DealBuilderForm } from "../forms/DealBuilderForm";
import { useDealMenuItems } from "../hooks/useDealMenuItems";
import { useCLC } from "@/context/CLCContext";
import { useServerAction } from "@/hooks/use-server-action";
import {
  createDealAction,
  updateDealAction,
  getDealDetailsAction,
  CreateDealPayload,
} from "@/app/actions/restaurant/menu";

interface DealsBuilderViewProps {
  dealId?: string;
}

export default function DealsBuilderView({ dealId }: DealsBuilderViewProps) {
  const router = useRouter();
  const { formatPrice } = useCLC();
  const t = useTranslations("RestaurantDashboard.Deals");

  const isEditing = Boolean(dealId);
  const [isLoadingDetails, setIsLoadingDetails] = useState(isEditing);

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [dealType, setDealType] = useState<DealCombo["dealType"]>("combo");
  const [status, setStatus] = useState<DealCombo["status"]>("active");
  const [badge, setBadge] = useState("BESTSELLER");
  const [image, setImage] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState("");

  const [selectedItems, setSelectedItems] = useState<DealItemSelection[]>([]);
  const [itemSearch, setItemSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [pricingMode, setPricingMode] = useState<
    "fixed_price" | "discount_percent"
  >("fixed_price");
  const [comboPriceInput, setComboPriceInput] = useState<number>(9.99);
  const [discountPercentInput, setDiscountPercentInput] = useState<number>(20);

  // Pre-fetch deal details when editing
  useEffect(() => {
    if (!isEditing || !dealId) return;

    let isMounted = true;
    setIsLoadingDetails(true);

    getDealDetailsAction(dealId)
      .then((res) => {
        if (!isMounted) return;

        if (res.success && res.data) {
          const d = res.data;
          setTitle(d.title || "");
          setDescription(d.description || "");
          setTagline(d.description || "");
          setDealType(d.dealType || "combo");
          setStatus(d.isActive !== false ? "active" : "inactive");
          setBadge(d.badge || "");
          setImage(d.image || "");

          if (d.startDate) {
            try {
              setStartDate(new Date(d.startDate).toISOString().split("T")[0]);
            } catch {
              setStartDate(d.startDate);
            }
          }
          if (d.endDate) {
            try {
              setEndDate(new Date(d.endDate).toISOString().split("T")[0]);
            } catch {
              setEndDate(d.endDate);
            }
          }

          const discType =
            d.discountType === "percentage" ? "discount_percent" : "fixed_price";
          setPricingMode(discType);

          if (discType === "discount_percent") {
            setDiscountPercentInput(Number(d.discountValue || 0));
          } else {
            const discVal = Number(d.discountValue || 0);
            const itemsArr = d.items || [];
            const origPriceSum = itemsArr.reduce(
              (sum: number, di: any) =>
                sum + Number(di.item?.basePrice || di.basePrice || 0),
              0,
            );
            const calcComboPrice = Math.max(0, origPriceSum - discVal);
            setComboPriceInput(calcComboPrice > 0 ? calcComboPrice : discVal);
          }

          if (d.items && Array.isArray(d.items)) {
            const mapped: DealItemSelection[] = d.items.map((di: any) => ({
              itemId: di.itemId || di.item?.id || di.id,
              name: di.item?.name || di.name || t("common.itemFallback"),
              quantity: 1,
              unitPrice: Number(di.item?.basePrice || di.unitPrice || 0),
              category:
                typeof di.item?.category === "string"
                  ? di.item?.category
                  : di.item?.category?.name || t("common.categoryFallback"),
              image: di.item?.image || di.image || "",
            }));
            setSelectedItems(mapped);
          }
        } else {
          toast.error(res.message || t("builderView.toastLoadFailed"));
        }
      })
      .catch((err) => {
        if (isMounted) {
          toast.error(err?.message || t("builderView.toastLoadError"));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingDetails(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dealId, isEditing]);

  const originalPrice = selectedItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );

  const finalComboPrice =
    pricingMode === "fixed_price"
      ? originalPrice > 0
        ? Math.min(comboPriceInput, originalPrice)
        : comboPriceInput
      : Math.max(0, originalPrice * (1 - discountPercentInput / 100));

  const discountAmount = Math.max(0, originalPrice - finalComboPrice);
  const discountPercentage =
    originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

  const handleItemQuantity = (itemOption: MenuItemOption, delta: number) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.itemId === itemOption.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) {
          return prev.filter((i) => i.itemId !== itemOption.id);
        }
        return prev.map((i) =>
          i.itemId === itemOption.id ? { ...i, quantity: newQty } : i,
        );
      } else if (delta > 0) {
        return [
          ...prev,
          {
            itemId: itemOption.id,
            name: itemOption.name,
            quantity: 1,
            unitPrice: itemOption.basePrice,
            category: itemOption.category,
            image: itemOption.image,
          },
        ];
      }
      return prev;
    });
  };

  const { items: apiMenuItems, categories: apiCategories } = useDealMenuItems(
    itemSearch,
    categoryFilter,
  );

  const filteredMenuItems = apiMenuItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(itemSearch.toLowerCase());
    const matchesCat =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories =
    apiCategories.length > 0
      ? apiCategories
      : Array.from(new Set(apiMenuItems.map((i) => i.category)));

  const { execute: executeCreateDeal, isPending: isCreating } = useServerAction(
    createDealAction,
    {
      onSuccess: () => {
        router.push("/restaurant/menu/deals");
      },
    },
  );

  const { execute: executeUpdateDeal, isPending: isUpdating } = useServerAction(
    (payload: any) => updateDealAction(dealId!, payload),
    {
      onSuccess: () => {
        router.push("/restaurant/menu/deals");
      },
    },
  );

  const isSaving = isCreating || isUpdating;

  const handleSave = () => {
    if (!title.trim()) {
      toast.error(t("builderView.toastTitleRequired"));
      return;
    }

    if (selectedItems.length === 0) {
      toast.error(t("builderView.toastItemsRequired"));
      return;
    }

    const discountType: "percentage" | "fixed" =
      pricingMode === "discount_percent" ? "percentage" : "fixed";
    const discountValue =
      pricingMode === "discount_percent"
        ? Number(discountPercentInput) || 0
        : Math.max(0, Number(discountAmount) || Number(comboPriceInput) || 0);

    const startIso = startDate
      ? new Date(startDate).toISOString()
      : new Date().toISOString();
    const endIso = endDate
      ? new Date(endDate).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const payload: CreateDealPayload = {
      title,
      description,
      dealType,
      badge,
      discountType,
      discountValue,
      startDate: startIso,
      endDate: endIso,
      isActive: status === "active",
      itemIds: selectedItems.map((i) => i.itemId),
      dealImage: image,
    };

    if (isEditing && dealId) {
      executeUpdateDeal(payload);
    } else {
      executeCreateDeal(payload);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/restaurant/menu/deals"
            className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Badge className="bg-orange-100 text-orange-700 font-bold text-[10px] uppercase">
            {isEditing ? t("builderView.editingMode") : t("builderView.builderMode")}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/restaurant/menu/deals")}
            disabled={isSaving}
            className="rounded-xl h-11 px-5 border-gray-200 text-xs font-semibold"
          >
            {t("builderView.cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-xl h-11 px-6 font-semibold shadow-xs flex items-center gap-2 text-xs cursor-pointer"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isSaving ? t("builderView.saving") : t("builderView.save")}</span>
          </Button>
        </div>
      </div>

      {isLoadingDetails ? (
        <Card className="p-16 text-center rounded-2xl border border-gray-100 bg-white flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-brand-orange" />
          <Typography className="text-sm font-bold text-gray-900">
            {t("builderView.loadingForEdit")}
          </Typography>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <DealBuilderForm
            title={title}
            setTitle={setTitle}
            tagline={tagline}
            setTagline={setTagline}
            description={description}
            setDescription={setDescription}
            dealType={dealType}
            setDealType={setDealType}
            badge={badge}
            setBadge={setBadge}
            image={image}
            setImage={setImage}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            selectedItems={selectedItems}
            handleItemQuantity={handleItemQuantity}
            itemSearch={itemSearch}
            setItemSearch={setItemSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            filteredMenuItems={filteredMenuItems}
            categories={categories}
            pricingMode={pricingMode}
            setPricingMode={setPricingMode}
            comboPriceInput={comboPriceInput}
            setComboPriceInput={setComboPriceInput}
            discountPercentInput={discountPercentInput}
            setDiscountPercentInput={setDiscountPercentInput}
            originalPrice={originalPrice}
            finalComboPrice={finalComboPrice}
            discountAmount={discountAmount}
            discountPercentage={discountPercentage}
          />
        </div>

        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <Card className="p-5 rounded-2xl border border-gray-100 shadow-sm bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-600" />
                <Typography className="text-sm font-bold text-gray-900">
                  {t("builderView.livePreview")}
                </Typography>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase">
                {t("builderView.customerView")}
              </Badge>
            </div>

            <div className="bg-gray-900 rounded-3xl p-3 shadow-xl">
              <div className="bg-white rounded-2xl overflow-hidden shadow-inner border border-gray-100">
                <div className="relative h-44 w-full bg-orange-50/70 border-b border-orange-100 flex items-center justify-center overflow-hidden">
                  {image ? (
                    <Image
                      src={image}
                      alt={title || t("builderView.dealImageAlt")}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-orange-400">
                      <UtensilsCrossed className="w-8 h-8 text-orange-500" />
                      <span className="text-[10px] font-medium text-gray-400">
                        {t("builderView.noImageUploaded")}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase">
                    {pricingMode === "fixed_price"
                      ? t("builderView.saveAmountBadge", {
                          amount: formatPrice(discountAmount),
                        })
                      : t("builderView.savePercentBadge", {
                          percent: discountPercentage,
                        })}
                  </div>
                  {badge && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase shadow-xs">
                      {badge}
                    </div>
                  )}
                </div>

                <div className="p-3.5">
                  <h4 className="font-bold text-gray-900 text-sm">
                    {title || t("builderView.titleFallback")}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                    {tagline || t("builderView.taglineFallback")}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {selectedItems.map((i, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md font-medium"
                      >
                        {i.quantity}x {i.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400 line-through font-mono mr-1">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="text-base font-bold text-orange-600 font-mono">
                        {formatPrice(finalComboPrice)}
                      </span>
                    </div>

                    <button className="bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs">
                      {t("builderView.addCombo")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )}
  </div>
);
}
