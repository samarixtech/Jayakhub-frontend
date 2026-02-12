import React from "react";
import RestaurantHeader from "@/components/restaurants/Header";

export default function RestaurantDiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <RestaurantHeader />
      <main className="flex-grow pt-[200px] md:pt-24">{children}</main>
    </div>
  );
}
