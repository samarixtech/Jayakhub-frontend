"use client";

import React from "react";
import { LayoutGrid, Sandwich, Pizza, Wine, CakeSlice, Globe } from "lucide-react";
import { usePOS } from "@/context/POSContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function POSSidebar() {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    activeView,
    setActiveView,
    activeCategory,
    setActiveCategory,
    globalCategories,
    isPosLoading,
  } = usePOS();

  // "All" is manually injected to allow fetching the full list without a category filter
  const categories = [
    { id: "all", label: "All", icon: LayoutGrid },
    ...globalCategories.map((catString: string) => ({
      id: catString,
      label: catString,
      icon: Sandwich, // Generic icon for dynamic categories
    })),
  ];

  const SidebarContent = () => (
    <aside className="w-[60px] shrink-0 bg-white lg:border-r border-gray-200 flex flex-col items-center py-2 h-full z-10 overflow-y-auto">
      <div className="flex-1 w-full flex flex-col items-center gap-4 pt-1">
        {isPosLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="w-[30px] h-[30px] rounded-full" />
              <Skeleton className="w-[40px] h-[10px] rounded-sm" />
            </div>
          ))
        ) : (categories.map((cat) => {
          const isActive = activeView === 'menu' && activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveView('menu');
                setActiveCategory(cat.id);
                setIsSidebarOpen(false);
              }} // Close on mobile click
              className={`flex flex-col items-center justify-center gap-1.5 w-[52px] h-[58px] rounded-xl mx-auto transition-colors relative ${isActive
                ? "text-[#357252] bg-[#edf6f1]"
                : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#357252] rounded-r-full"></div>
              )}
              <Icon
                className={`w-[22px] h-[22px] ${isActive ? "text-[#357252]" : "text-gray-400 group-hover:text-gray-600"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] font-extrabold tracking-wide text-center leading-tight line-clamp-1 ${isActive ? "text-[#357252]" : "text-gray-400"
                  }`}
              >
                {cat.label}
              </span>
            </button>
          );
        }))}
      </div>

      <button
        onClick={() => {
          setActiveView('online');
          setIsSidebarOpen(false);
        }}
        className={`flex flex-col items-center justify-center gap-1.5 w-[52px] h-[58px] rounded-xl mx-auto transition-colors relative mt-auto mb-2 ${activeView === 'online'
          ? "text-[#357252] bg-[#edf6f1]"
          : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          }`}
      >
        {activeView === 'online' && (
          <div className="absolute left-0 top-2 bottom-2 w-[3.5px] bg-[#357252] rounded-r-full"></div>
        )}
        <div className="absolute top-1.5 right-1.5 w-[16px] h-[16px] bg-[#ef4444] rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-white">
          3
        </div>
        <Globe
          className={`w-[22px] h-[22px] ${activeView === 'online' ? "text-[#357252]" : "text-gray-400 group-hover:text-gray-600"}`}
          strokeWidth={activeView === 'online' ? 2.5 : 2}
        />
        <span
          className={`text-[10px] font-extrabold tracking-wide ${activeView === 'online' ? "text-[#357252]" : "text-gray-400"}`}
        >
          Online
        </span>
      </button>
    </aside>
  );

  return (
    <>
      <div className="hidden lg:flex h-full">
        <SidebarContent />
      </div>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[60px] border-r-0 pt-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Categories</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
