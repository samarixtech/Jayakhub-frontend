"use client";

import POSMenuGrid from "@/components/modules/restaurant/pos/views/POSMenuGridView";
import POSCartPanel from "@/components/modules/restaurant/pos/components/POSCartPanel";

export default function POSPage() {
  return (
    <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
      <POSMenuGrid />
      <POSCartPanel />
    </div>
  );
}
