import React, { useState } from "react";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToPDF } from "@/lib/utils/pdfs/pdf-export";

interface FinanceHeaderProps {
    filter: string;
    setFilter: (val: string) => void;
    reportRef: React.RefObject<HTMLDivElement | null>;
    restaurantName: string;
}

const filterOptions = [
    { value: "1", label: "Last 1 Month" },
    { value: "3", label: "Last 3 Months" },
    { value: "6", label: "Last 6 Months" },
    { value: "12", label: "Last 12 Months" },
    { value: "all", label: "All Time" },
];

const FinanceHeader = ({ filter, setFilter, reportRef, restaurantName }: FinanceHeaderProps) => {
    const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const currentFilterLabel = filterOptions.find((o) => o.value === filter)?.label || "All Time";

    const handleExportPDF = async () => {
        if (!reportRef.current) return;

        setIsExporting(true);
        // Wait a moment for any UI changes to settle
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Generate filename based on filter
        const dateStr = new Date().toISOString().split('T')[0];
        const filename = `Finance_Report_${restaurantName.replace(/\s+/g, '_')}_${currentFilterLabel.replace(/\s+/g, '_')}_${dateStr}.pdf`;

        await exportToPDF({
            element: reportRef.current,
            filename,
            onSuccess: () => {
                setIsExporting(false);
            },
            onError: (error) => {
                setIsExporting(false);
                console.error("Error generating PDF:", error);
            }
        });
    };

    return (
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Finance Dashboard</h1>
            <div className="flex justify-end items-center gap-3 relative">
                <div className="relative">
                    <Button
                        variant="outline"
                        className="bg-white border-gray-200 h-9 text-[13px]"
                        onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                        disabled={isExporting}
                    >
                        <ChevronDown className="mr-2 w-4 h-4 text-gray-400" />
                        {currentFilterLabel}
                    </Button>

                    {filterDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${filter === opt.value ? "font-bold text-[#346853]" : "text-gray-700"
                                        }`}
                                    onClick={() => {
                                        setFilter(opt.value);
                                        setFilterDropdownOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    variant="outline"
                    className="bg-[#346853] text-white hover:bg-[#2a5644] hover:text-white border-0 h-9 text-[13px]"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                >
                    {isExporting ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="mr-2 w-4 h-4" />
                    )}
                    {isExporting ? "Exporting..." : "Export PDF"}
                </Button>
            </div>
        </div>
    );
};

export default FinanceHeader;
