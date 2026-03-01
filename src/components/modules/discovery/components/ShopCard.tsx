import React from "react";
import { Clock } from "lucide-react";

import { ShopProps } from "@/components/modules/discovery/discovery.types";

const ShopCard = ({ data }: { data: ShopProps }) => {
  return (
    <div className="group shrink-0 w-[70%] sm:w-[40%] md:w-[30%] lg:w-[21%] cursor-pointer bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image Section */}
      <div className="h-28 w-full bg-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Optional: Add badge or overlay if needed later */}
      </div>

      {/* Content Section */}
      <div className="p-3">
        <h3 className="font-bold text-gray-900 text-sm truncate mb-1">
          {data.name}
        </h3>

        <div className="flex items-center gap-1 text-xs font-medium text-green-600">
          <Clock className="h-3 w-3" />
          <span>{data.deliveryTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
