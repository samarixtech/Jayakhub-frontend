import React from "react";
import { SlidersHorizontal, Tag, Pizza, Sandwich } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"; // Assuming Label exists, or we use simple label tag

const FilterBar = () => {
  return (
    <div className="flex flex-wrap items-center gap-3 pb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="bg-emerald-bg hover:bg-emerald-bg-hover text-white rounded-lg gap-2 shadow-emerald-900/10">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-5 bg-white" align="start">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h4 className="font-bold text-lg text-gray-900">Filter By</h4>
              <span className="text-xs text-emerald-bg font-bold cursor-pointer hover:underline">
                Reset
              </span>
            </div>

            {/* Sort By */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-gray-800">Sort By</h5>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recommended"
                    className="data-[state=checked]:bg-emerald-bg data-[state=checked]:border-none"
                    defaultChecked
                  />
                  <label
                    htmlFor="recommended"
                    className="text-sm text-gray-600 font-medium"
                  >
                    Recommended
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rating"
                    className="data-[state=checked]:bg-emerald-bg data-[state=checked]:border-none"
                  />
                  <label
                    htmlFor="rating"
                    className="text-sm text-gray-600 font-medium"
                  >
                    Rating
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="time"
                    className="data-[state=checked]:bg-emerald-bg data-[state=checked]:border-none"
                  />
                  <label
                    htmlFor="time"
                    className="text-sm text-gray-600 font-medium"
                  >
                    Delivery Time
                  </label>
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-gray-800">Price Range</h5>
              <div className="flex gap-2">
                {["$", "$$", "$$$", "$$$$"].map((price) => (
                  <button
                    key={price}
                    className="flex-1 h-9 rounded-md border border-gray-200 text-sm font-bold text-gray-600 hover:border-emerald-bg hover:text-emerald-bg focus:bg-emerald-bg focus:text-white transition-all"
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <Button className="w-full bg-emerald-bg hover:bg-emerald-bg-hover text-white font-bold h-11 rounded-xl mt-2">
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

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
