import React from "react";
import GlobalTable, { Column } from "@/components/common/GlobalTable";

export interface TrafficSource {
  id: string;
  source: string; // e.g., "Direct", "Social Media"
  subtext?: string;
  orders: number;
  sales: string;
  conversionRate: string;
}

const MOCK_TRAFFIC: TrafficSource[] = [
  {
    id: "1",
    source: "Direct",
    orders: 845,
    sales: "$24,500.00",
    conversionRate: "4.2%",
  },
  {
    id: "2",
    source: "Social Media",
    subtext: "Instagram, Facebook",
    orders: 320,
    sales: "$12,400.00",
    conversionRate: "2.8%",
  },
  {
    id: "3",
    source: "Search Engine",
    subtext: "Google Organic",
    orders: 115,
    sales: "$5,200.00",
    conversionRate: "3.5%",
  },
  {
    id: "4",
    source: "Email Campaigns",
    orders: 85,
    sales: "$3,131.89",
    conversionRate: "5.1%",
  },
];

const TrafficSourceTable = () => {
  const columns: Column<TrafficSource>[] = [
    {
      header: "TRAFFIC SOURCE",
      cell: (item) => (
        <div>
          <span className="font-bold text-gray-900 block">{item.source}</span>
          {item.subtext && (
            <span className="text-xs text-gray-500">{item.subtext}</span>
          )}
        </div>
      ),
    },
    {
      header: "ORDERS",
      accessorKey: "orders",
      className: "text-gray-700",
    },
    {
      header: "SALES",
      accessorKey: "sales",
      className: "text-gray-900 font-medium",
    },
    {
      header: "CONVERSION RATE",
      accessorKey: "conversionRate",
      className: "text-gray-700",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Sales by Traffic Source
        </h2>
        <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
          View Report
        </button>
      </div>
      <GlobalTable
        data={MOCK_TRAFFIC}
        columns={columns}
        // Simplified table, no pagination needed for this widget likely
      />
    </div>
  );
};

export default TrafficSourceTable;
