"use client";
import { useState } from "react";
import { Bell, ChevronLeft, ChevronRight, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import Image from "next/image";

// Mock Data
const TRANSACTIONS = [
  {
    id: 1,
    description: "Sushi Master",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=100&auto=format&fit=crop",
    date: "Nov 15, 2025 • 2:30 PM",
    method: "Visa •• 4242",
    amount: "42.50",
    type: "debit",
  },
  {
    id: 2,
    description: "Premium Subscription",
    icon: "👑",
    date: "Nov 14, 2025 • 12:00 PM",
    method: "Visa •• 4242",
    amount: "9.99",
    type: "debit",
  },
  {
    id: 3,
    description: "Burger & Co.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=100&auto=format&fit=crop",
    date: "Oct 24, 2025 • 8:30 PM",
    method: "PayPal",
    amount: "28.00",
    type: "debit",
  },
  {
    id: 4,
    description: "Refund: Green Bowl",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=100&auto=format&fit=crop",
    date: "Oct 18, 2025 • 3:15 PM",
    method: "Visa •• 4242",
    amount: "22.00",
    type: "credit",
  },
];

export default function CustomerBillingView() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-5">
      <div className="max-w-full mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <Typography
              variant="h2"
              className="text-[#1F2937] font-black text-2xl tracking-tight"
            >
              Billing
            </Typography>
            <Typography variant="p" className="text-gray-500 text-sm mt-1">
              View your payment transactions and billing
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-200 bg-white"
            >
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button className="rounded-full border border-gray-200 bg-white text-black h-11 px-6">
              <DownloadIcon className="h-5 w-5" /> Export CSV
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
            <Typography className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Total Spent
            </Typography>
            <Typography className="text-4xl font-black text-[#111827]">
              $1,248.50
            </Typography>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
            <Typography className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              This Month
            </Typography>
            <Typography className="text-4xl font-black text-[#111827]">
              $286.00
            </Typography>
          </Card>
        </div>

        {/* Transactions Table Section */}
        <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <div className="px-8 flex justify-between items-center border-b border-gray-50">
            <Typography className="font-bold text-lg text-gray-900">
              Transactions
            </Typography>
            <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
              {["All", "Credits", "Debits"].map((item) => (
                <Button
                  key={item}
                  onClick={() => setFilter(item)}
                  variant="ghost"
                  className={`h-8 px-5 rounded-lg text-xs font-bold transition-all ${
                    filter === item
                      ? "bg-white text-emerald-bg shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Description
                  </th>
                  <th className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Date
                  </th>
                  <th className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Method
                  </th>
                  <th className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Amount
                  </th>
                  <th className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TRANSACTIONS.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`group transition-colors ${tx.type === "credit" ? "bg-emerald-50/40" : "hover:bg-gray-50/50"}`}
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 shrink-0">
                          {tx.image ? (
                            <Image
                              src={tx.image}
                              alt={tx.description}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-sm">{tx.icon}</span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {tx.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-medium text-gray-400">
                      {tx.date}
                    </td>
                    <td className="px-8 py-4 text-xs font-medium text-gray-500">
                      {tx.method}
                    </td>
                    <td
                      className={`px-8 py-4 text-sm font-black ${tx.type === "credit" ? "text-emerald-500" : "text-gray-900"}`}
                    >
                      {tx.type === "credit"
                        ? `+$${tx.amount}`
                        : `$${tx.amount}`}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-3 text-[10px] font-bold text-gray-400 border-gray-100 hover:bg-gray-50 uppercase tracking-tighter"
                      >
                        PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="p-6 border-t border-gray-50 flex justify-between items-center">
            <Typography className="text-xs font-medium text-gray-400">
              Showing 1-4 of 12
            </Typography>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-gray-100 text-gray-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button className="h-8 w-8 rounded-full bg-emerald-bg text-white text-xs font-bold shadow-sm">
                1
              </Button>
              <Button
                variant="ghost"
                className="h-8 w-8 rounded-full text-xs font-bold text-gray-400"
              >
                2
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full border border-gray-100 text-gray-400"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
