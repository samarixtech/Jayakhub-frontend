import React from "react";
import { Ticket, Star, Sparkles, Leaf } from "lucide-react";

const CATEGORIES = [
  { id: "vouchers", label: "Vouchers", icon: Ticket },
  { id: "top_rated", label: "Top Rated", icon: Star },
  { id: "new", label: "New on JayakHub", icon: Sparkles },
  { id: "healthier", label: "Healthier Options", icon: Leaf },
];

const CategoryIcons = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          className="flex flex-col items-center gap-3 group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md group-hover:border-emerald-100 transition-all">
            <cat.icon className="h-6 w-6 text-[#346853]" />
          </div>
          <span className="text-xs md:text-sm font-bold text-gray-800 group-hover:text-[#346853] transition-colors">
            {cat.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryIcons;
