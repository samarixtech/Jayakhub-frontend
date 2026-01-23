"use client";
import { useState } from "react";
import { FileDown, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";

// Mock Data
const PAST_ORDERS = [
  {
    id: "#ORD-2025-001",
    restaurant: "Gourmet Garden",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop",
    date: "Jan 02, 2025",
    items: "2x Caesar Salad, 1x Water",
    total: "24.50",
    status: "Delivered",
  },
  {
    id: "#ORD-2024-892",
    restaurant: "Pizza Republic",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&auto=format&fit=crop",
    date: "Dec 28, 2024",
    items: "1x Pepperoni, 2x Colas",
    total: "42.00",
    status: "Delivered",
  },
  {
    id: "#ORD-2024-880",
    restaurant: "Burger King",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop",
    date: "Dec 20, 2024",
    items: "1x Whopper Meal",
    total: "15.50",
    status: "Cancelled",
  },
];

export default function CustomerOrderHistory() {
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "All Statuses",
    "Last 30 Days",
  ]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-5">
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-[#111827] font-bold text-2xl"
            >
              Order History
            </Typography>
            <Typography variant="small" className="text-gray-500">
              Track your past orders
            </Typography>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full border-gray-200 bg-white text-gray-700 h-11 px-6 hover:bg-gray-50 transition-colors"
            >
              <FileDown className="h-4 w-4" /> Export CSV
            </Button>
            <Button className="rounded-full bg-emerald-bg hover:bg-emerald-bg text-white h-11 px-6 shadow-sm transition-all">
              <Plus className="h-4 w-4" /> New Order
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3">
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <CardTitle className="text-base font-bold text-gray-900">
                  Filters
                </CardTitle>
                <Button
                  onClick={() => setActiveFilters([])}
                  className="text-emerald-bg text-sm font-medium hover:underline bg-transparent hover:bg-transparent cursor-pointer"
                >
                  Reset
                </Button>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Status Section */}
                <div>
                  <Typography
                    variant="p"
                    className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4"
                  >
                    status
                  </Typography>
                  <div className="space-y-4">
                    {[
                      "All Statuses",
                      "Delivered",
                      "Cancelled",
                      "In Progress",
                    ].map((status) => (
                      <div
                        key={status}
                        className="flex items-center space-x-3 group cursor-pointer"
                      >
                        <Checkbox
                          id={status}
                          checked={activeFilters.includes(status)}
                          onCheckedChange={(checked) => {
                            setActiveFilters((prev) =>
                              checked
                                ? [...prev, status]
                                : prev.filter((s) => s !== status),
                            );
                          }}
                          className="border-gray-300 data-[state=checked]:bg-emerald-bg data-[state=checked]:border-emerald-bg"
                        />
                        <label
                          htmlFor={status}
                          className="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-black"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Range Section */}
                <div>
                  <Typography
                    variant="p"
                    className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4"
                  >
                    Date Range
                  </Typography>
                  <div className="space-y-4">
                    {["Last 30 Days", "Last 3 Months"].map((range) => (
                      <div
                        key={range}
                        className="flex items-center space-x-3 group cursor-pointer"
                      >
                        <Checkbox
                          id={range}
                          checked={activeFilters.includes(range)}
                          onCheckedChange={(checked) => {
                            setActiveFilters((prev) =>
                              checked
                                ? [...prev, range]
                                : prev.filter((s) => s !== range),
                            );
                          }}
                          className="border-gray-300 data-[state=checked]:bg-emerald-bg data-[state=checked]:border-emerald-bg"
                        />
                        <label
                          htmlFor={range}
                          className="text-sm font-semibold text-gray-700 cursor-pointer group-hover:text-black"
                        >
                          {range}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-emerald-bg hover:bg-emerald-bg-hover rounded-full h-12 font-bold mt-4 shadow-sm transition-colors">
                  Apply Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-4">
            {PAST_ORDERS.map((order) => (
              <Card
                key={order.id}
                className={`border-none rounded-2xl transition-all hover:shadow-md overflow-hidden p-0 ${
                  order.status === "Cancelled" ? "bg-red-100/50" : "bg-white"
                }`}
              >
                <CardContent className="p-4 flex items-center">
                  <div className="relative w-14 h-14 shrink-0 mr-5">
                    <Image
                      src={order.image}
                      alt={order.restaurant}
                      fill
                      className="rounded-xl object-cover"
                      sizes="56px"
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                    {/* Restaurant Info */}
                    <div className="md:col-span-4">
                      <Typography
                        variant="h3"
                        className="font-bold text-gray-900 text-sm "
                      >
                        {order.restaurant}
                      </Typography>

                      <Typography
                        variant="p"
                        className="text-[11px] text-gray-400 mt-0.5 font-medium"
                      >
                        {order.id} • {order.date}
                      </Typography>
                    </div>

                    {/* Order Items */}
                    <div className="md:col-span-3 text-xs text-gray-500 line-clamp-1 font-medium pr-2">
                      {order.items}
                    </div>

                    {/* Actions & Status */}
                    <div className="md:col-span-5 flex items-center justify-end gap-5">
                      <Badge
                        className={`rounded-full px-3 py-0.5 flex items-center gap-1.5 border-none font-bold text-[9px] tracking-wide uppercase ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-100 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        <span className="text-[10px]">
                          {order.status === "Delivered" ? "✓" : "✕"}
                        </span>
                        {order.status}
                      </Badge>

                      <span className="font-black text-gray-900 text-sm min-w-[60px] text-right">
                        ${order.total}
                      </span>

                      {order.status === "Delivered" ? (
                        <Button className="rounded-full bg-emerald-bg hover:bg-emerald-bg-hover text-white h-9 px-4 text-[11px] font-bold gap-2 border-none transition-colors">
                          <RefreshCw size={14} /> Reorder
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="rounded-full border-gray-200 text-gray-700 bg-white hover:bg-gray-50 h-9 px-6 text-[11px] font-bold transition-all"
                        >
                          Help
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between pt-8">
              <Typography
                variant="p"
                className="text-sm font-medium text-gray-400 mb-4 md:mb-0"
              >
                Showing 1-3 of 24 orders
              </Typography>

              <Pagination className="mx-0 w-auto">
                <PaginationContent className="gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      className="text-gray-400 hover:bg-transparent hover:text-gray-600 border-none p-2"
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive
                      className="w-9 h-9 rounded-full bg-emerald-bg text-white font-bold hover:bg-[#1B4332] hover:text-white border-none"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      className="w-9 h-9 rounded-full text-gray-600 font-bold hover:bg-gray-100 border-none"
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      className="w-9 h-9 rounded-full text-gray-600 font-bold hover:bg-gray-100 border-none"
                    >
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      className="text-gray-400 hover:bg-transparent hover:text-gray-600 border-none p-2"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
