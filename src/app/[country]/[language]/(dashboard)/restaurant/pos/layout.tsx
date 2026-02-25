import React, { ReactNode } from "react";
import POSNavbar from "@/components/modules/restaurant/pos/posHeader";
import POSSidebar from "@/components/modules/restaurant/pos/pos-Sidebar";
import { POSProvider } from "@/context/POSContext";

export const metadata = {
  title: "POS System - Jayak Hub",
  description: "Point of Sale Interface for Jayak Hub Menu",
};

export default function POSLayout({ children }: { children: ReactNode }) {
  return (
    <POSProvider>
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-gray-50 font-sans selection:bg-emerald-200">
        <POSNavbar />
        <div className="flex-1 flex overflow-hidden">
          <POSSidebar />
          <main className="flex-1 flex overflow-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </POSProvider>
  );
}
