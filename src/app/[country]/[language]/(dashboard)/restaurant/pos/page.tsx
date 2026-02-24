import React from "react";
import POSMenuGrid from "@/components/pos/posMenuGrid";
import POSCartPanel from "@/components/pos/posCartPanel";

export default function POSPage() {
    return (
        <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
            <POSMenuGrid />
            <POSCartPanel />
        </div>
    );
}
