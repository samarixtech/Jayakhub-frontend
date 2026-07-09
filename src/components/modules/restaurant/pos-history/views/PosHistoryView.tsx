"use client";

import { ClipboardList, DollarSign, TrendingUp, Award } from "lucide-react";

const STATS = [
  { label: "Total Orders", icon: ClipboardList },
  { label: "Total Sales", icon: DollarSign },
  { label: "Avg. Order Value", icon: TrendingUp },
  { label: "Top Seller (Cashier)", icon: Award },
];

const TABLE_COLUMNS = [
  "Order ID",
  "Order Type",
  "Cashier",
  "Payment Method",
  "Items",
  "Total",
  "Status",
  "Time",
];

export default function PosHistoryView() {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50">
              <Icon className="w-5 h-5 text-[#357252]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-[22px] font-bold text-[#1a1a1a] leading-none">
                --
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-[15px] text-[#1a1a1a]">Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="text-left px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={TABLE_COLUMNS.length} className="px-5 py-16">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ClipboardList className="w-10 h-10 mb-3 text-gray-200" />
                    <p className="font-bold text-[14px]">No data</p>
                    <p className="text-[12px] text-gray-400 mt-1">
                      Order data will appear here once connected.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
