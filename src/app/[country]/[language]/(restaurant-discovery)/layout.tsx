import React from "react";
import RestaurantHeader from "@/components/restaurants/Header";
import { DiscoveryUIProvider } from "@/app/context/DiscoveryUIContext";

export default function RestaurantDiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DiscoveryUIProvider>
        <RestaurantHeader />
        <main className="grow pt-[140px] md:pt-24">{children}</main>
      </DiscoveryUIProvider>
    </div>
  );
}
