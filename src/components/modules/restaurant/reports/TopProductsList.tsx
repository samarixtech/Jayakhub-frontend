import React from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  unitsSold: number;
  revenue: string;
  image: string; // Placeholder or actual URL
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Classic Cheeseburger",
    unitsSold: 324,
    revenue: "$4.5k",
    image: "/food1.png", // We'll just use a colored div fallback if image fails
  },
  {
    id: "2",
    name: "Pepperoni Pizza",
    unitsSold: 215,
    revenue: "$3.2k",
    image: "/food2.png",
  },
  {
    id: "3",
    name: "Curly Fries (L)",
    unitsSold: 189,
    revenue: "$1.1k",
    image: "/food3.png",
  },
  {
    id: "4",
    name: "Vanilla Shake",
    unitsSold: 145,
    revenue: "$890",
    image: "/food4.png",
  },
];

const TopProductsList = () => {
  return (
    <div className="w-full">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Top Products by Units Sold
      </h2>
      <div className="space-y-6">
        {MOCK_PRODUCTS.map((product) => (
          <div key={product.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 relative overflow-hidden flex items-center justify-center text-gray-400">
                {/* Fallback for image since we lack actual assets */}
                <span className="text-[10px] font-bold">AVG</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {product.unitsSold} units sold
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-gray-900">
              {product.revenue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsList;
