import React from "react";
import { SlidersHorizontal, Tag, Pizza, Sandwich } from "lucide-react";
import { Button } from "@/components/ui/button";

const FilterBar = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 pb-6">
      <Button className="bg-[#346853] hover:bg-[#2a5443] text-white rounded-lg gap-2">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </Button>

      <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden md:block" />

      <Button
        variant="outline"
        className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg gap-2"
      >
        <Tag className="h-4 w-4" />
        Top Offers
      </Button>

      <Button
        variant="outline"
        className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg gap-2"
      >
        <Sandwich className="h-4 w-4" />
        Burgers
      </Button>

      <Button
        variant="outline"
        className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg gap-2"
      >
        <Pizza className="h-4 w-4" />
        Pizza
      </Button>
    </div>
  );
};

export default FilterBar;
