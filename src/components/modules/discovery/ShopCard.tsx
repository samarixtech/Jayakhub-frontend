import React from "react";
import { Clock } from "lucide-react";

interface ShopProps {
  id: string;
  name: string;
  image: string;
  deliveryTime: string;
}

const ShopCard = ({ data }: { data: ShopProps }) => {
  return (
    <div className="group min-w-[200px] w-[200px] cursor-pointer">
      <div className="h-28 w-full bg-gray-100 rounded-xl overflow-hidden mb-2 relative">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <img
          src={data.image}
          alt={data.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Logo Overlay Style */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full border-2 border-white overflow-hidden shadow-sm hidden">
          {/* Optional Logo */}
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-bold text-gray-900 text-sm truncate">
          {data.name}
        </h3>
        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 mt-0.5">
          <Clock className="h-3 w-3" />
          <span>{data.deliveryTime}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
