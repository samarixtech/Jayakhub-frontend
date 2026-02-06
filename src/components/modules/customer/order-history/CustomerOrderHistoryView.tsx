"use client";
import { useState, useEffect } from "react";
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
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "All Statuses",
    "Last 30 Days",
  ]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const res = await getAllOrders();
        if (res.success && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Filter Logic (Mock implementation for now as API returns all)
  const filteredOrders = orders.filter((order) => {
    if (activeFilters.includes("All Statuses")) return true;
    // Add real filtering logic here if needed
    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading orders...</div>;
  }

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
            {currentOrders.map((order) => {
              // Image Handling
              const firstItemImage =
                order.items && order.items.length > 0
                  ? order.items[0].image
                  : null;
              const imageUrl = firstItemImage
                ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${firstItemImage.replace(/\\/g, "/")}`
                : null;

              return (
                <Card
                  key={order.orderId}
                  className={`border-none rounded-2xl transition-all hover:shadow-md overflow-hidden p-0 ${
                    order.status === "cancelled" ? "bg-red-100/50" : "bg-white"
                  }`}
                >
                  <CardContent className="p-4 flex items-center">
                    <div className="relative w-14 h-14 shrink-0 mr-5 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Order Item"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-bold text-gray-400 text-xs">
                          IMG
                        </span>
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center gap-2">
                      {/* Order Info */}
                      <div className="md:col-span-4">
                        <Typography
                          variant="h3"
                          className="font-bold text-gray-900 text-sm "
                        >
                          Order #{order.orderId.substring(0, 8)}...
                        </Typography>

                        <Typography
                          variant="p"
                          className="text-[11px] text-gray-400 mt-0.5 font-medium"
                        >
                          {order.orderDate} • {order.orderTime}
                        </Typography>
                      </div>

                      {/* Order Items Summary */}
                      <div className="md:col-span-3 text-xs text-gray-500 line-clamp-1 font-medium pr-2">
                        {order.items
                          .map((i: any) => `${i.quantity}x ${i.name}`)
                          .join(", ")}
                      </div>

                      {/* Actions & Status */}
                      <div className="md:col-span-5 flex items-center justify-end gap-5">
                        <Badge
                          className={`rounded-full px-3 py-0.5 flex items-center gap-1.5 border-none font-bold text-[9px] tracking-wide uppercase ${
                            order.status === "delivered" ||
                            order.status === "paid"
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <span className="text-[10px]">
                            {order.status === "delivered" ? "✓" : "•"}
                          </span>
                          {order.status}
                        </Badge>

                        <span className="font-black text-gray-900 text-sm min-w-[60px] text-right">
                          ${Number(order.totalAmount).toFixed(2)}
                        </span>

                        {order.status === "delivered" ? (
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
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-between pt-8">
                <Typography
                  variant="p"
                  className="text-sm font-medium text-gray-400 mb-4 md:mb-0"
                >
                  Showing {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, filteredOrders.length)}{" "}
                  of {filteredOrders.length} orders
                </Typography>

                <Pagination className="mx-0 w-auto">
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`text-gray-400 border-none p-2 cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-transparent hover:text-gray-600"}`}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={currentPage === page}
                            className={`w-9 h-9 rounded-full font-bold border-none cursor-pointer ${
                              currentPage === page
                                ? "bg-emerald-bg text-white hover:bg-[#1B4332] hover:text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`text-gray-400 border-none p-2 cursor-pointer ${currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-transparent hover:text-gray-600"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
