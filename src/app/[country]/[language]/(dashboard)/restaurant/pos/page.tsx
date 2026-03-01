"use client";

import React from "react";
import POSMenuGrid from "@/components/modules/restaurant/pos/posMenuGrid";
import POSCartPanel from "@/components/modules/restaurant/pos/posCartPanel";
import OnlineOrdersView from "@/components/modules/restaurant/pos/online-orders-view";
import { usePOS } from "@/context/POSContext";

export default function POSPage() {
  const { activeView } = usePOS();

  return (
    <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
      {activeView === "menu" ? <POSMenuGrid /> : <OnlineOrdersView />}
      <POSCartPanel />
    </div>
  );
}
