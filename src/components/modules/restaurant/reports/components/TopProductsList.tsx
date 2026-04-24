"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Star, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCLC } from "@/context/CLCContext";

interface TopProductsListProps {
  products?: any[];
}

const TopProductsList = ({ products = [] }: TopProductsListProps) => {
  const t = useTranslations("RestaurantDashboard.Reports.topProducts");
  const { formatPrice } = useCLC();
  const [activeView, setActiveView] = useState<"all" | "detail" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const totalRevenue = products.reduce(
    (acc, p) => acc + (p.revenue || p.total || 0),
    0,
  );

  const formattedProducts = products.map((p, index) => ({
    id: String(index + 1),
    rank: index + 1,
    name: p.name,
    category: p.category || t("detail.category") || "N/A",
    unitsSold: p.quantity,
    revenue: formatPrice(p.revenue || p.total || 0),
    numericRevenue: p.revenue || p.total || 0,
    image: p.image || "",
    rankColor:
      index === 0
        ? "text-amber-600"
        : index === 1
          ? "text-blue-600"
          : index === 2
            ? "text-orange-600"
            : "text-slate-600",
    rankBgColor:
      index === 0
        ? "bg-amber-100"
        : index === 1
          ? "bg-blue-50"
          : index === 2
            ? "bg-orange-50"
            : "bg-slate-100",
    rating: typeof p.rating === "number" ? p.rating : 4.5,
    price: formatPrice(
      p.price !== undefined ? p.price : (p.total || 0) / (p.quantity || 1),
    ),
    cost: formatPrice(p.cost || 0),
    profit: formatPrice(p.profit || p.total || 0),
    profitMargin: p.profitMargin || "100%",
  }));

  const handleOpenAll = () => {
    setActiveView("all");
    setSelectedProduct(null);
  };

  const handleOpenDetail = (product: any) => {
    setSelectedProduct(product);
    setActiveView("detail");
  };

  const handleClose = () => {
    setActiveView(null);
    setSelectedProduct(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-start mb-6 w-full">
        <div>
          <h2 className="text-[16px] font-bold text-[#1b2d22] leading-none">
            {t("title")}
          </h2>
          <p className="text-[12px] text-[#8ea89a] mt-1 font-medium">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={handleOpenAll}
          className="text-[12px] font-bold text-[#357252] transition-colors hover:text-[#189b74]"
        >
          {t("viewAll")}
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1 w-full mt-2">
        {formattedProducts.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-50/50 p-1 -m-1 rounded-lg transition-colors"
            onClick={() => handleOpenDetail(product)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-6 h-6 rounded flex items-center justify-center text-[11px] font-black",
                  product.rankBgColor,
                  product.rankColor,
                )}
              >
                {product.rank}
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                {product.image ? (
                  <img
                    src={process.env.NEXT_PUBLIC_IMAGE_BASE_URL + product.image}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={product.name}
                  />
                ) : (
                  <span className="text-[14px]">🍔</span>
                )}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[13px] font-bold text-[#1b2d22] leading-tight">
                  {product.name}
                </h3>
                <p className="text-[11px] font-medium text-[#8ea89a] mt-0.5">
                  {product.category}
                </p>
              </div>
            </div>
            <span className="text-[13px] font-black text-[#1b2d22]">
              {product.revenue}
            </span>
          </div>
        ))}
      </div>

      {/* Sheet Sidebar */}
      <Sheet
        open={activeView !== null}
        onOpenChange={(open) => !open && handleClose()}
      >
        <SheetContent
          className="w-full sm:max-w-[420px] md:max-w-[460px] border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.06)] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden"
          side="right"
        >
          {/* ===== ALL PRODUCTS VIEW ===== */}
          {activeView === "all" && (
            <div className="flex flex-col w-full h-full">
              {/* Header */}
              <div className="px-6 pt-5 pb-4 flex justify-between items-start">
                <div>
                  <SheetTitle className="text-[18px] font-bold text-[#1a1a1a] leading-tight">
                    {t("allProducts")}
                  </SheetTitle>
                  <p className="text-[13px] text-[#8a8a8a] font-normal mt-0.5">
                    {t("rankedSubtitle", { count: formattedProducts.length })}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {/* Green Summary Bar */}
                <div className="bg-[#f0f9f4] rounded-xl px-5 py-3.5 mb-5 flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-[#2d6a4f]">
                    {formattedProducts.length} {t("products")}
                  </span>
                  <span className="text-[20px] font-black text-[#2d6a4f]">
                    {formatPrice(totalRevenue)}
                  </span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[28px_1fr_52px_72px_56px] gap-2 items-center px-1 mb-2">
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide">
                    #
                  </span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide">
                    {t("columns.product")}
                  </span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide text-center">
                    {t("columns.units")}
                  </span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide text-right">
                    {t("columns.revenue")}
                  </span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide text-right">
                    {t("columns.rating")}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-1" />

                {/* Product Rows */}
                <div className="flex flex-col">
                  {formattedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[28px_1fr_52px_72px_56px] gap-2 items-center px-1 py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-b-0"
                      onClick={() => handleOpenDetail(product)}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center">
                        <span
                          className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black",
                            product.rankBgColor,
                            product.rankColor,
                          )}
                        >
                          {product.rank}
                        </span>
                      </div>

                      {/* Product Name + Image */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 relative overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                          {product.image ? (
                            <img
                              src={
                                process.env.NEXT_PUBLIC_IMAGE_BASE_URL +
                                product.image
                              }
                              className="absolute inset-0 w-full h-full object-cover"
                              alt={product.name}
                            />
                          ) : (
                            <span className="text-[12px]">🍔</span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-[13px] font-semibold text-[#1a1a1a] leading-tight truncate">
                            {product.name}
                          </h3>
                          <p className="text-[11px] font-normal text-[#a0a0a0] mt-0.5 truncate">
                            {product.category}
                          </p>
                        </div>
                      </div>

                      {/* Units */}
                      <div className="text-[13px] font-semibold text-[#1a1a1a] text-center">
                        {product.unitsSold}
                      </div>

                      {/* Revenue */}
                      <div className="text-[13px] font-semibold text-[#1a1a1a] text-right">
                        {product.revenue}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 text-[#f5a623] fill-[#f5a623]" />
                        <span className="text-[13px] font-semibold text-[#1a1a1a]">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== PRODUCT DETAIL VIEW ===== */}
          {activeView === "detail" && selectedProduct && (
            <div className="flex flex-col w-full h-full bg-white">
              {/* Header */}
              <div className="px-6 pt-5 pb-3 flex justify-between items-start">
                <div>
                  <SheetTitle className="text-[18px] font-bold text-[#1a1a1a] leading-tight">
                    {selectedProduct.name}
                  </SheetTitle>
                  <p className="text-[13px] text-[#8a8a8a] font-normal mt-0.5">
                    {selectedProduct.category} · {selectedProduct.unitsSold}{" "}
                    {t("detail.unitsSoldLabel")}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0 mt-0.5"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {/* Product Image + Name Block */}
                <div className="flex items-center gap-4 py-4">
                  <div className="w-[56px] h-[56px] rounded-xl bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                    {selectedProduct.image ? (
                      <img
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_BASE_URL +
                          selectedProduct.image
                        }
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={selectedProduct.name}
                      />
                    ) : (
                      <span className="text-[24px]">🍔</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[16px] font-bold text-[#1a1a1a] leading-tight">
                      {selectedProduct.name}
                    </h3>
                    <p className="text-[13px] font-normal text-[#8a8a8a] mt-0.5">
                      {selectedProduct.category}
                    </p>
                  </div>
                </div>

                {/* 2×4 Metric Grid */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {/* Units Sold */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.unitsSold")}
                    </span>
                    <span className="text-[22px] font-black text-[#1a1a1a] leading-tight">
                      {selectedProduct.unitsSold}
                    </span>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.totalRevenue")}
                    </span>
                    <span className="text-[22px] font-black text-[#1a1a1a] leading-tight">
                      {selectedProduct.revenue}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.price")}
                    </span>
                    <span className="text-[18px] font-black text-[#1a1a1a] leading-tight">
                      {selectedProduct.price}
                    </span>
                  </div>

                  {/* Cost */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.cost")}
                    </span>
                    <span className="text-[18px] font-black text-[#1a1a1a] leading-tight">
                      {selectedProduct.cost}
                    </span>
                  </div>

                  {/* Profit */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.profit")}
                    </span>
                    <span className="text-[18px] font-bold text-[#2d9c6f] leading-tight">
                      {selectedProduct.profit}
                    </span>
                  </div>

                  {/* Profit Margin */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.profitMargin")}
                    </span>
                    <span className="text-[18px] font-black text-[#1a1a1a] leading-tight">
                      {selectedProduct.profitMargin}
                    </span>
                  </div>

                  {/* Customer Rating */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.customerRating")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#f5a623] fill-[#f5a623]" />
                      <span className="text-[18px] font-black text-[#1a1a1a]">
                        {selectedProduct.rating}
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">
                      {t("detail.category")}
                    </span>
                    <span className="text-[16px] font-bold text-[#1a1a1a] leading-tight">
                      {selectedProduct.category}
                    </span>
                  </div>
                </div>

                {/* Avg Revenue Per Unit Bar */}
                <div className="mt-5 bg-[#e8f5ee] rounded-xl px-5 py-4 flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-[#2d6a4f]">
                    {t("detail.avgRevenue")}
                  </span>
                  <span className="text-[18px] font-black text-[#2d6a4f]">
                    {selectedProduct.price}
                  </span>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TopProductsList;
