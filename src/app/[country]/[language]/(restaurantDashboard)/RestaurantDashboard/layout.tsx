"use client";

import { useState } from "react";
import Sidebar from "@/components/RestaurantDashboard/Sidebar";
import TopHeader from "@/components/RestaurantDashboard/TopHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
      

        {/* Mobile top bar to toggle sidebar */}
        <header className="md:hidden flex items-center justify-between bg-[#E8F4F1] px-4 py-3 shadow">
          <h1 className="font-bold text-lg"></h1>
          <button onClick={() => setSidebarOpen(true)}>
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>
          <TopHeader />

        {/* Dashboard content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
