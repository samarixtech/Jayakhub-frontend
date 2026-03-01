"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Star, X } from "lucide-react";

interface Product {
  id: string;
  rank: number;
  name: string;
  category: string;
  unitsSold: number;
  revenue: string;
  numericRevenue: number;
  image: string;
  rankColor: string;
  rankBgColor: string;
  rating: number;
  price: string;
  cost: string;
  profit: string;
  profitMargin: string;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    rank: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    unitsSold: 324,
    revenue: "$4,536",
    numericRevenue: 4536,
    image: "/burger.jpg",
    rankColor: "text-amber-600",
    rankBgColor: "bg-amber-100",
    rating: 4.8,
    price: "$14.00",
    cost: "$3.20",
    profit: "$3,499.2",
    profitMargin: "77.1%",
  },
  {
    id: "2",
    rank: 2,
    name: "Pepperoni Pizza",
    category: "Pizzas",
    unitsSold: 215,
    revenue: "$3,225",
    numericRevenue: 3225,
    image: "/pizza-palace.jpg",
    rankColor: "text-blue-600",
    rankBgColor: "bg-blue-50",
    rating: 4.7,
    price: "$15.00",
    cost: "$4.00",
    profit: "$2,365.0",
    profitMargin: "73.3%",
  },
  {
    id: "3",
    rank: 3,
    name: "Curly Fries (L)",
    category: "Sides",
    unitsSold: 189,
    revenue: "$1,134",
    numericRevenue: 1134,
    image: "/sausage-feast.jpg",
    rankColor: "text-orange-600",
    rankBgColor: "bg-orange-50",
    rating: 4.5,
    price: "$6.00",
    cost: "$1.50",
    profit: "$850.5",
    profitMargin: "75.0%",
  },
  {
    id: "4",
    rank: 4,
    name: "Vanilla Shake",
    category: "Beverages",
    unitsSold: 145,
    revenue: "$870",
    numericRevenue: 870,
    image: "/DeliciousFood.png",
    rankColor: "text-slate-600",
    rankBgColor: "bg-slate-100",
    rating: 4.6,
    price: "$6.00",
    cost: "$2.00",
    profit: "$580.0",
    profitMargin: "66.7%",
  },
  {
    id: "5",
    rank: 5,
    name: "Grilled Chicken Wrap",
    category: "Wraps",
    unitsSold: 132,
    revenue: "$1,584",
    numericRevenue: 1584,
    image: "/mixed-grill.jpg",
    rankColor: "text-slate-600",
    rankBgColor: "bg-slate-100",
    rating: 4.4,
    price: "$12.00",
    cost: "$4.00",
    profit: "$1,056.0",
    profitMargin: "66.7%",
  },
  {
    id: "6",
    rank: 6,
    name: "Caesar Salad",
    category: "Salads",
    unitsSold: 98,
    revenue: "$980",
    numericRevenue: 980,
    image: "/green-garden.png",
    rankColor: "text-slate-600",
    rankBgColor: "bg-slate-100",
    rating: 4.3,
    price: "$10.00",
    cost: "$3.00",
    profit: "$686.0",
    profitMargin: "70.0%",
  },
  {
    id: "7",
    rank: 7,
    name: "Chocolate Lava Cake",
    category: "Desserts",
    unitsSold: 87,
    revenue: "$696",
    numericRevenue: 696,
    image: "/partner-hero.jpg",
    rankColor: "text-slate-600",
    rankBgColor: "bg-slate-100",
    rating: 4.9,
    price: "$8.00",
    cost: "$2.50",
    profit: "$478.5",
    profitMargin: "68.8%",
  },
  {
    id: "8",
    rank: 8,
    name: "Lemonade",
    category: "Beverages",
    unitsSold: 210,
    revenue: "$840",
    numericRevenue: 840,
    image: "/gourmet.jpg",
    rankColor: "text-slate-600",
    rankBgColor: "bg-slate-100",
    rating: 4.2,
    price: "$4.00",
    cost: "$1.00",
    profit: "$630.0",
    profitMargin: "75.0%",
  },
];

const TopProductsList = () => {
  const [activeView, setActiveView] = useState<"all" | "detail" | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenAll = () => {
    setActiveView("all");
    setSelectedProduct(null);
  };

  const handleOpenDetail = (product: Product) => {
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
            Top Products
          </h2>
          <p className="text-[12px] text-[#8ea89a] mt-1 font-medium">
            By units sold
          </p>
        </div>
        <button
          onClick={handleOpenAll}
          className="text-[12px] font-bold text-[#357252] transition-colors hover:text-[#189b74]"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4 flex-1 w-full mt-2">
        {MOCK_PRODUCTS.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between w-full cursor-pointer hover:bg-gray-50/50 p-1 -m-1 rounded-lg transition-colors"
            onClick={() => handleOpenDetail(product)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-[11px] font-black",
                product.rankBgColor,
                product.rankColor
              )}>
                {product.rank}
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                {product.image ? (
                  <img src={product.image} className="absolute inset-0 w-full h-full object-cover" alt={product.name} />
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
      <Sheet open={activeView !== null} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent
          className="w-full sm:max-w-[420px] md:max-w-[460px] border-l border-gray-200 shadow-[-8px_0_24px_rgba(0,0,0,0.06)] p-0 flex flex-col overflow-hidden bg-white [&>button]:hidden"
          side="right"
        >

          {/* ===== ALL PRODUCTS VIEW ===== */}
          {activeView === 'all' && (
            <div className="flex flex-col w-full h-full">
              {/* Header */}
              <div className="px-6 pt-5 pb-4 flex justify-between items-start">
                <div>
                  <SheetTitle className="text-[18px] font-bold text-[#1a1a1a] leading-tight">All Products</SheetTitle>
                  <p className="text-[13px] text-[#8a8a8a] font-normal mt-0.5">8 products ranked by units sold</p>
                </div>
                <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0 mt-0.5">
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {/* Green Summary Bar */}
                <div className="bg-[#f0f9f4] rounded-xl px-5 py-3.5 mb-5 flex justify-between items-center">
                  <span className="text-[14px] font-semibold text-[#2d6a4f]">8 Products</span>
                  <span className="text-[20px] font-black text-[#2d6a4f]">$13,865</span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-[28px_1fr_52px_72px_56px] gap-2 items-center px-1 mb-2">
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide">#</span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide">Product</span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide text-center">Units</span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide text-right">Revenue</span>
                  <span className="text-[11px] font-semibold text-[#a0a0a0] uppercase tracking-wide text-right">Rating</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mb-1" />

                {/* Product Rows */}
                <div className="flex flex-col">
                  {MOCK_PRODUCTS.map((product) => (
                    <div
                      key={product.id}
                      className="grid grid-cols-[28px_1fr_52px_72px_56px] gap-2 items-center px-1 py-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-b-0"
                      onClick={() => handleOpenDetail(product)}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center">
                        <span className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-black",
                          product.rankBgColor,
                          product.rankColor
                        )}>
                          {product.rank}
                        </span>
                      </div>

                      {/* Product Name + Image */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 relative overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                          {product.image ? (
                            <img src={product.image} className="absolute inset-0 w-full h-full object-cover" alt={product.name} />
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
                      <div className="text-[13px] font-semibold text-[#1a1a1a] text-center">{product.unitsSold}</div>

                      {/* Revenue */}
                      <div className="text-[13px] font-semibold text-[#1a1a1a] text-right">{product.revenue}</div>

                      {/* Rating */}
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-3 h-3 text-[#f5a623] fill-[#f5a623]" />
                        <span className="text-[13px] font-semibold text-[#1a1a1a]">{product.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== PRODUCT DETAIL VIEW ===== */}
          {activeView === 'detail' && selectedProduct && (
            <div className="flex flex-col w-full h-full bg-white">
              {/* Header */}
              <div className="px-6 pt-5 pb-3 flex justify-between items-start">
                <div>
                  <SheetTitle className="text-[18px] font-bold text-[#1a1a1a] leading-tight">{selectedProduct.name}</SheetTitle>
                  <p className="text-[13px] text-[#8a8a8a] font-normal mt-0.5">{selectedProduct.category} · {selectedProduct.unitsSold} units sold</p>
                </div>
                <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 shrink-0 mt-0.5">
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {/* Product Image + Name Block */}
                <div className="flex items-center gap-4 py-4">
                  <div className="w-[56px] h-[56px] rounded-xl bg-gray-100 relative overflow-hidden flex items-center justify-center shrink-0 border border-gray-100">
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} className="absolute inset-0 w-full h-full object-cover" alt={selectedProduct.name} />
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
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Units Sold</span>
                    <span className="text-[22px] font-black text-[#1a1a1a] leading-tight">{selectedProduct.unitsSold}</span>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Total Revenue</span>
                    <span className="text-[22px] font-black text-[#1a1a1a] leading-tight">{selectedProduct.revenue}</span>
                  </div>

                  {/* Price */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Price</span>
                    <span className="text-[18px] font-black text-[#1a1a1a] leading-tight">{selectedProduct.price}</span>
                  </div>

                  {/* Cost */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Cost</span>
                    <span className="text-[18px] font-black text-[#1a1a1a] leading-tight">{selectedProduct.cost}</span>
                  </div>

                  {/* Profit */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Profit</span>
                    <span className="text-[18px] font-bold text-[#2d9c6f] leading-tight">{selectedProduct.profit}</span>
                  </div>

                  {/* Profit Margin */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Profit Margin</span>
                    <span className="text-[18px] font-black text-[#1a1a1a] leading-tight">{selectedProduct.profitMargin}</span>
                  </div>

                  {/* Customer Rating */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Customer Rating</span>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#f5a623] fill-[#f5a623]" />
                      <span className="text-[18px] font-black text-[#1a1a1a]">{selectedProduct.rating}</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="bg-white border border-gray-200 rounded-xl px-4 py-3.5">
                    <span className="text-[10px] font-semibold text-[#8a8a8a] uppercase tracking-wider block mb-1.5">Category</span>
                    <span className="text-[16px] font-bold text-[#1a1a1a] leading-tight">{selectedProduct.category}</span>
                  </div>
                </div>

                {/* Avg Revenue Per Unit Bar */}
                <div className="mt-5 bg-[#e8f5ee] rounded-xl px-5 py-4 flex justify-between items-center">
                  <span className="text-[13px] font-semibold text-[#2d6a4f]">Avg Revenue Per Unit</span>
                  <span className="text-[18px] font-black text-[#2d6a4f]">{selectedProduct.price}</span>
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
