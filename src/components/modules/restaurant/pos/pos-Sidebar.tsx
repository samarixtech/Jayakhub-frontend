"use client";

import React from "react";
import { LayoutGrid, Sandwich, Pizza, Wine, CakeSlice } from "lucide-react";
import { usePOS } from "@/app/context/POSContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function POSSidebar() {
    const { isSidebarOpen, setIsSidebarOpen } = usePOS();

    const categories = [
        { id: "all", label: "All", icon: LayoutGrid },
        { id: "burgers", label: "Burgers", icon: Sandwich },
        { id: "pizza", label: "Pizza", icon: Pizza },
        { id: "drink", label: "Drink", icon: Wine },
        { id: "dessert", label: "Dessert", icon: CakeSlice },
    ];

    const SidebarContent = () => (
        <aside className="w-[60px] shrink-0 bg-white lg:border-r border-gray-200 flex flex-col items-center py-2 h-full z-10 overflow-y-auto">
            {categories.map((cat, idx) => {
                const isActive = idx === 0;
                const Icon = cat.icon;
                return (
                    <button
                        key={cat.id}
                        onClick={() => setIsSidebarOpen(false)} // Close on mobile click
                        className={`flex flex-col items-center justify-center gap-1 w-full h-[60px] transition-colors relative ${isActive
                            ? "text-[#357252] bg-emerald-50/40"
                            : "text-gray-400 hover:bg-gray-50"
                            }`}
                    >
                        {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#357252]"></div>
                        )}
                        <Icon className={`w-[20px] h-[20px] ${isActive ? "text-[#357252]" : "text-gray-400"}`} strokeWidth={isActive ? 2.5 : 2} />
                        <span className={`text-[9px] font-bold tracking-wide ${isActive ? "text-[#357252]" : "text-gray-400"}`}>
                            {cat.label}
                        </span>
                    </button>
                );
            })}
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
