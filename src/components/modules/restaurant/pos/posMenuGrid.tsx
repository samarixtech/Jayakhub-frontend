"use client";

import React from "react";
import Image from "next/image";
import { usePOS } from "@/app/context/POSContext";
import { Plus } from "lucide-react";

const menuItems = [
    { id: 1, name: "Angus Beef Burger", price: 14.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop" },
    { id: 2, name: "Truffle Mushroom Burger", price: 16.00, image: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=300&auto=format&fit=crop" },
    { id: 3, name: "Crispy Chicken Deluxe", price: 13.50, image: "https://images.unsplash.com/photo-1615719413546-198b25453f85?q=80&w=300&auto=format&fit=crop" },
    { id: 4, name: "Classic Margherita", price: 12.00, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=300&auto=format&fit=crop" },
    { id: 5, name: "Pepperoni Feast", price: 15.00, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=300&auto=format&fit=crop" },
    { id: 6, name: "BBQ Chicken Pizza", price: 16.50, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop" },
    { id: 7, name: "Coca-Cola Zero", price: 3.00, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop" },
    { id: 8, name: "Craft Lemonade", price: 4.50, image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=300&auto=format&fit=crop" },
    { id: 9, name: "Iced Matcha Latte", price: 5.50, image: "https://images.unsplash.com/photo-1536281140500-7b624452fa13?q=80&w=300&auto=format&fit=crop" },
    { id: 10, name: "Tiramisu", price: 7.00, image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=300&auto=format&fit=crop" },
    { id: 11, name: "Cheesecake", price: 6.50, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=300&auto=format&fit=crop" },
    { id: 12, name: "French Fries", price: 5.00, image: "https://images.unsplash.com/photo-1576107232684-1279f3908581?q=80&w=300&auto=format&fit=crop" },
];

export default function POSMenuGrid() {
    const { addToCart } = usePOS();

    return (
        <div className="flex-1 bg-[#f4f5f7] p-3 sm:p-4 overflow-y-auto w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => addToCart(item)}
                        className="group bg-white rounded-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden cursor-pointer flex flex-col hover:shadow-md hover:border-[#357252]/30 transition-all active:scale-95 duration-200 relative"
                    >
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 text-[#357252] shadow-sm">
                            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                        </div>

                        <div className="h-[90px] md:h-[100px] w-full relative bg-gray-100 overflow-hidden">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                        </div>
                        <div className="p-2 sm:p-2.5 flex flex-col gap-1">
                            <h3 className="text-[11px] sm:text-[12px] font-extrabold text-[#333] leading-snug truncate group-hover:text-[#357252] transition-colors">
                                {item.name}
                            </h3>
                            <p className="text-[#357252] font-black text-[11px] sm:text-[12px]">
                                ${item.price.toFixed(2)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
