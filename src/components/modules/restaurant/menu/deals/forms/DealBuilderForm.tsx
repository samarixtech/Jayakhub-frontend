"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { format, parseISO } from "date-fns";
import {
  ChevronDown,
  Plus,
  Minus,
  Tag,
  Search,
  Percent,
  Check,
  Loader2,
  Calendar as CalendarIcon,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DealCombo,
  MenuItemOption,
  DealItemSelection,
  DEAL_TYPE_OPTIONS,
} from "../types/deals";
import { DealImageUpload } from "../components/DealImageUpload";
import { useCLC } from "@/context/CLCContext";

export interface DealBuilderFormProps {
  title: string;
  setTitle: (val: string) => void;
  tagline: string;
  setTagline: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  dealType: DealCombo["dealType"];
  setDealType: (val: DealCombo["dealType"]) => void;
  badge: string;
  setBadge: (val: string) => void;
  image: string;
  setImage: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  selectedItems: DealItemSelection[];
  handleItemQuantity: (itemOption: MenuItemOption, delta: number) => void;
  itemSearch: string;
  setItemSearch: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  filteredMenuItems: MenuItemOption[];
  categories: string[];
  pricingMode: "fixed_price" | "discount_percent";
  setPricingMode: (val: "fixed_price" | "discount_percent") => void;
  comboPriceInput: number;
  setComboPriceInput: (val: number) => void;
  discountPercentInput: number;
  setDiscountPercentInput: (val: number) => void;
  originalPrice: number;
  finalComboPrice: number;
  discountAmount: number;
  discountPercentage: number;
}

export function DealBuilderForm({
  title,
  setTitle,
  tagline,
  setTagline,
  description,
  setDescription,
  dealType,
  setDealType,
  badge,
  setBadge,
  image,
  setImage,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedItems,
  handleItemQuantity,
  itemSearch,
  setItemSearch,
  categoryFilter,
  setCategoryFilter,
  filteredMenuItems,
  categories,
  pricingMode,
  setPricingMode,
  comboPriceInput,
  setComboPriceInput,
  discountPercentInput,
  setDiscountPercentInput,
  originalPrice,
  finalComboPrice,
  discountAmount,
  discountPercentage,
}: DealBuilderFormProps) {
  const { formatPrice, currency } = useCLC();
  const t = useTranslations("RestaurantDashboard.Deals");

  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(6);
  }, [itemSearch, categoryFilter]);

  const loadMoreItems = () => {
    if (visibleCount < filteredMenuItems.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 6, filteredMenuItems.length));
        setIsLoadingMore(false);
      }, 250);
    }
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredMenuItems.length &&
          !isLoadingMore
        ) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filteredMenuItems.length, isLoadingMore]);

  const handleItemsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop - clientHeight <= 120 &&
      visibleCount < filteredMenuItems.length &&
      !isLoadingMore
    ) {
      loadMoreItems();
    }
  };

  const visibleMenuItems = filteredMenuItems.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <Card className="p-6 rounded-2xl border border-gray-100 shadow-xs bg-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <Typography className="text-base font-bold text-gray-900">
              {t("form.section1Title")}
            </Typography>
            <Typography className="text-xs text-gray-500">
              {t("form.section1Subtitle")}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.titleLabel")}
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("form.titlePlaceholder")}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.taglineLabel")}
            </Label>
            <Input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder={t("form.taglinePlaceholder")}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.dealTypeLabel")}
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 rounded-xl border-gray-200 bg-white text-sm justify-between px-3 font-normal cursor-pointer"
                >
                  <span className="text-xs font-medium text-gray-900">
                    {DEAL_TYPE_OPTIONS.some((opt) => opt.value === dealType)
                      ? t(`dealTypes.${dealType}`)
                      : t("dealTypes.combo")}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-xl bg-white"
              >
                {DEAL_TYPE_OPTIONS.map((opt) => (
                  <DropdownMenuItem
                    key={opt.value}
                    onClick={() => setDealType(opt.value)}
                    className="cursor-pointer text-xs font-medium"
                  >
                    {t(`dealTypes.${opt.value}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.badgeLabel")}
            </Label>
            <Input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder={t("form.badgePlaceholder")}
              className="h-11 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.startDateLabel")}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal border border-gray-200 bg-white rounded-xl px-3.5 text-gray-900 cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all text-sm"
                >
                  <span>
                    {startDate
                      ? format(parseISO(startDate), "PPP")
                      : t("form.pickStartDate")}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white shadow-md border border-gray-100 rounded-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate ? parseISO(startDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(format(date, "yyyy-MM-dd"));
                    }
                  }}
                  className="rounded-xl p-3"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.endDateLabel")}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-between text-left font-normal border border-gray-200 bg-white rounded-xl px-3.5 text-gray-900 cursor-pointer hover:border-gray-300 hover:bg-gray-50/50 transition-all text-sm"
                >
                  <span>
                    {endDate
                      ? format(parseISO(endDate), "PPP")
                      : t("form.pickEndDate")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {endDate && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEndDate("");
                        }}
                        className="text-gray-400 hover:text-red-500 p-0.5 rounded-full cursor-pointer"
                        title={t("form.clearEndDateTitle")}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white shadow-md border border-gray-100 rounded-xl"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={endDate ? parseISO(endDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      setEndDate(format(date, "yyyy-MM-dd"));
                    } else {
                      setEndDate("");
                    }
                  }}
                  disabled={
                    startDate ? { before: parseISO(startDate) } : undefined
                  }
                  className="rounded-xl p-3"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DealImageUpload imagePreview={image} onImageChange={setImage} />

        <div className="space-y-2">
          <Label className="text-xs font-bold text-gray-700 uppercase">
            {t("form.descriptionLabel")}
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("form.descriptionPlaceholder")}
            className="rounded-xl min-h-[70px]"
          />
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border border-gray-100 shadow-xs bg-white space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <Typography className="text-base font-bold text-gray-900">
                {t("form.section2Title")}
              </Typography>
              <Typography className="text-xs text-gray-500">
                {t("form.section2Subtitle")}
              </Typography>
            </div>
          </div>

          <span className="text-xs font-bold text-navy bg-gray-100 px-3 py-1 rounded-full font-mono">
            {t("form.itemsSubtotal", { amount: formatPrice(originalPrice) })}
          </span>
        </div>

        <div className="bg-orange-50/60 border border-orange-200/80 p-4 rounded-2xl space-y-2">
          <Typography className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-orange-600" />
            {t("form.selectedItems", { count: selectedItems.length })}
          </Typography>

          {selectedItems.length === 0 ? (
            <p className="text-xs text-orange-700 italic">
              {t("form.noItemsSelected")}
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedItems.map((selectedItem) => (
                <div
                  key={selectedItem.itemId}
                  className="bg-white border border-orange-200 rounded-xl p-2 flex items-center gap-2 shadow-2xs"
                >
                  <span className="text-xs font-bold text-gray-900">
                    {selectedItem.name}
                  </span>
                  <div className="flex items-center gap-1 bg-orange-100/80 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleItemQuantity(
                          filteredMenuItems.find(
                            (m) => m.id === selectedItem.itemId,
                          ) || {
                            id: selectedItem.itemId,
                            name: selectedItem.name,
                            category: selectedItem.category,
                            basePrice: selectedItem.unitPrice,
                            image: selectedItem.image || "",
                          },
                          -1,
                        )
                      }
                      className="p-1 hover:bg-orange-200 rounded-md text-orange-900 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-orange-950 px-1">
                      {selectedItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleItemQuantity(
                          filteredMenuItems.find(
                            (m) => m.id === selectedItem.itemId,
                          ) || {
                            id: selectedItem.itemId,
                            name: selectedItem.name,
                            category: selectedItem.category,
                            basePrice: selectedItem.unitPrice,
                            image: selectedItem.image || "",
                          },
                          1,
                        )
                      }
                      className="p-1 hover:bg-orange-200 rounded-md text-orange-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={itemSearch}
              onChange={(e) => setItemSearch(e.target.value)}
              placeholder={t("form.searchItemsPlaceholder")}
              className="pl-9 h-11 rounded-xl text-sm"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-11 rounded-xl text-xs">
              <SelectValue placeholder={t("form.allCategories")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">{t("form.allCategories")}</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          onScroll={handleItemsScroll}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar"
        >
          {visibleMenuItems.map((item) => {
            const selected = selectedItems.find((i) => i.itemId === item.id);
            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  selected
                    ? "bg-orange-50/50 border-orange-300 shadow-2xs"
                    : "bg-white border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100/80 overflow-hidden shrink-0 relative flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div>
                    <Typography className="text-xs font-bold text-gray-900">
                      {item.name}
                    </Typography>
                    <span className="text-[11px] text-gray-500 font-mono">
                      {formatPrice(item.basePrice)} • {item.category}
                    </span>
                  </div>
                </div>

                {selected ? (
                  <div className="flex items-center gap-1 bg-white border border-orange-200 rounded-xl p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleItemQuantity(item, -1)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-orange-600 px-1.5">
                      {selected.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleItemQuantity(item, 1)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleItemQuantity(item, 1)}
                    className="h-8 rounded-xl border-gray-200 text-xs font-semibold hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 mr-1" /> {t("form.add")}
                  </Button>
                )}
              </div>
            );
          })}

          <div ref={sentinelRef} className="col-span-full h-2 w-full" />

          {isLoadingMore && (
            <div className="col-span-full py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-orange-600 bg-orange-50/60 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("form.loadingMoreItems")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
          <span>
            {t("form.showingItems", {
              shown: visibleMenuItems.length,
              total: filteredMenuItems.length,
            })}
          </span>
          {visibleCount < filteredMenuItems.length && (
            <button
              type="button"
              onClick={loadMoreItems}
              disabled={isLoadingMore}
              className="text-brand-orange hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>
                {t("form.loadMoreItems", {
                  count: filteredMenuItems.length - visibleMenuItems.length,
                })}
              </span>
            </button>
          )}
        </div>
      </Card>

      <Card className="p-6 rounded-2xl border border-gray-100 shadow-xs bg-white space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <Typography className="text-base font-bold text-gray-900">
              {t("form.section3Title")}
            </Typography>
            <Typography className="text-xs text-gray-500">
              {t("form.section3Subtitle")}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setPricingMode("fixed_price")}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              pricingMode === "fixed_price"
                ? "border-brand-orange bg-orange-50/40 shadow-xs"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
            }`}
          >
            {pricingMode === "fixed_price" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-brand-orange flex items-center justify-center font-bold text-base font-mono mb-2">
              {currency || "$"}
            </div>
            <Typography className="text-sm font-bold text-gray-900">
              {t("form.fixedPriceTitle")}
            </Typography>
            <Typography className="text-xs text-gray-500 mt-0.5">
              {t("form.fixedPriceDesc")}
            </Typography>
          </button>

          <button
            type="button"
            onClick={() => setPricingMode("discount_percent")}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
              pricingMode === "discount_percent"
                ? "border-brand-orange bg-orange-50/40 shadow-xs"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50"
            }`}
          >
            {pricingMode === "discount_percent" && (
              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
            <div className="w-9 h-9 rounded-xl bg-orange-100/80 text-brand-orange flex items-center justify-center mb-2">
              <Percent className="w-5 h-5" />
            </div>
            <Typography className="text-sm font-bold text-gray-900">
              {t("form.percentDiscountTitle")}
            </Typography>
            <Typography className="text-xs text-gray-500 mt-0.5">
              {t("form.percentDiscountDesc")}
            </Typography>
          </button>
        </div>

        {pricingMode === "fixed_price" ? (
          <div className="space-y-2 max-w-xs">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-gray-700 uppercase">
                {t("form.comboSpecialPrice", { currency: currency || "$" })}
              </Label>
              {originalPrice > 0 && (
                <span className="text-[11px] text-gray-400 font-mono">
                  {t("form.maxAmount", { amount: formatPrice(originalPrice) })}
                </span>
              )}
            </div>
            <Input
              type="number"
              step="0.01"
              min="0"
              max={originalPrice > 0 ? originalPrice : undefined}
              value={comboPriceInput}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                if (originalPrice > 0 && val > originalPrice) {
                  setComboPriceInput(originalPrice);
                } else {
                  setComboPriceInput(val);
                }
              }}
              className="h-11 rounded-xl font-mono text-lg font-bold"
            />
            {originalPrice > 0 && comboPriceInput >= originalPrice && (
              <p className="text-[11px] font-semibold text-amber-600">
                {t("form.priceCapWarning", {
                  amount: formatPrice(originalPrice),
                })}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <Label className="text-xs font-bold text-gray-700 uppercase">
              {t("form.discountPercentLabel")}
            </Label>
            <Input
              type="number"
              min="1"
              max="90"
              value={discountPercentInput}
              onChange={(e) => setDiscountPercentInput(Number(e.target.value))}
              className="h-11 rounded-xl font-mono text-lg font-bold max-w-xs"
            />
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
          <Typography className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {t("form.summaryTitle")}
          </Typography>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("form.sumOfItems")}</span>
            <span className="font-mono font-semibold text-gray-900">
              {formatPrice(originalPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("form.specialComboPrice")}</span>
            <span className="font-mono font-bold text-navy text-lg">
              {formatPrice(finalComboPrice)}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-sm">
            <span className="text-emerald-700 font-semibold">
              {t("form.customerSavings")}
            </span>
            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              {t("form.saveOff", {
                amount: formatPrice(discountAmount),
                percent: discountPercentage,
              })}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
