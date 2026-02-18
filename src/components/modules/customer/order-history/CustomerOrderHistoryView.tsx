"use client";
import { useState, useEffect } from "react";
import { FileDown, Plus, RefreshCw, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrdersSkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

// Enum for Order Status
export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  PREPARE = "prepare",
  READY = "ready",
  OUT_FOR_DELIVERY = "out_of_delivery",
  DELIVERED = "delivered",
  REJECTED = "rejected",
}

// Interface based on the API response provided
interface OrderItem {
  name: string;
  price: string;
  quantity: number;
  image: string; // "uploads\item-images\..."
}

interface PaymentDetails {
  cardNumber: string;
  cardType: string;
  ownerName: string;
}

interface Order {
  orderId: string;
  totalAmount: string;
  OrderStatus: string; // Maps to OrderStatus enum values
  paymentMethod: string;
  orderDate: string;
  orderTime: string;
  paymentDetails: PaymentDetails;
  items: OrderItem[];
}

interface OrderSummary {
  totalSpend: string;
  totalOrdersCount: number;
  totalPendingOrders: number;
}

interface OrdersResponse {
  summary: OrderSummary;
  orders: Order[];
}

export default function CustomerOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState("30"); // days

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { getAllOrders } = await import("@/app/actions/customer/order");
        const res = await getAllOrders();
        if (res.success) {
          const responseData = res.data as any;
          if (
            responseData?.data?.orders &&
            Array.isArray(responseData.data.orders)
          ) {
            setOrders(responseData.data.orders);
          } else if (
            responseData?.orders &&
            Array.isArray(responseData.orders)
          ) {
            setOrders(responseData.orders);
          } else if (Array.isArray(responseData)) {
            setOrders(responseData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all") {
      const status = order.OrderStatus?.toLowerCase() || "";

      if (statusFilter === "delivered") {
        return status === OrderStatus.DELIVERED;
      }
      if (statusFilter === "cancelled") {
        return status === OrderStatus.REJECTED;
      }
      if (statusFilter === "active") {
        return [
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.PREPARE,
          OrderStatus.READY,
          OrderStatus.OUT_FOR_DELIVERY,
        ].includes(status as OrderStatus);
      }
    }
    // Date filtering could be added here if we parse orderDate
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

  const getImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    // Handle Windows backslashes
    const cleanPath = path.replace(/\\/g, "/");

    // Check if path already starts with /
    const hasLeadingSlash = cleanPath.startsWith("/");

    // Use NEXT_PUBLIC_BASE_URL or fallback
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

    // Remove trailing slash from base url if present
    const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

    return hasLeadingSlash
      ? `${cleanBaseUrl}${cleanPath}`
      : `${cleanBaseUrl}/${cleanPath}`;
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case OrderStatus.DELIVERED:
        return "bg-emerald-100 text-emerald-700";
      case OrderStatus.REJECTED:
        return "bg-red-100 text-red-600";
      case OrderStatus.OUT_FOR_DELIVERY:
        return "bg-purple-100 text-purple-700";
      case OrderStatus.READY:
        return "bg-indigo-100 text-indigo-700";
      case OrderStatus.PREPARE:
        return "bg-blue-100 text-blue-700";
      case OrderStatus.ACCEPTED:
        return "bg-blue-50 text-blue-600";
      case OrderStatus.PENDING:
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case OrderStatus.OUT_FOR_DELIVERY:
        return "Out for Delivery";
      default:
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  if (loading) {
    return <OrdersSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-5xl mx-auto space-y-4 md:space-y-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 md:gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-[#111827] font-black text-xl md:text-2xl"
            >
              Orders
            </Typography>
            <Typography
              variant="small"
              className="text-gray-500 mt-0.5 md:mt-1 text-xs md:text-sm"
            >
              Track your past orders
            </Typography>
          </div>
          <div className="flex gap-2.5 md:gap-3 w-full sm:w-auto">
            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex-1 sm:flex-none rounded-full border-gray-200 bg-white text-gray-700 h-9 px-3 hover:bg-gray-50 text-[10px] font-bold"
            >
              <Filter className="h-3 w-3 mr-1.5" /> Filters
            </Button>

            <Button
              variant="outline"
              className="hidden md:flex rounded-full border-gray-200 bg-white text-gray-700 h-10 px-4 hover:bg-gray-50 transition-colors text-xs font-bold"
            >
              <FileDown className="h-3.5 w-3.5 mr-2" /> Export CSV
            </Button>
            <Button className="flex-1 sm:flex-none rounded-full bg-emerald-bg hover:bg-emerald-bg text-white h-9 md:h-10 px-4 md:px-5 shadow-sm transition-all text-[10px] md:text-xs font-bold">
              <Plus className="h-3 md:h-3.5 w-3 md:w-3.5 mr-1.5 md:mr-2" /> New
              Order
            </Button>
          </div>
        </header>

        {/* Filters Bar - Responsive Visibility */}
        <div
          className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row bg-white rounded-2xl p-4 md:p-2 md:pl-6 shadow-sm items-start md:items-center gap-4 md:gap-6 overflow-x-auto transition-all`}
        >
          <span className="text-sm font-bold text-gray-900 shrink-0 mb-2 md:mb-0">
            Filters:
          </span>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 flex-1 w-full md:w-auto">
            {/* Status Checkboxes */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-all"
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
                checked={statusFilter === "all"}
                onCheckedChange={() => setStatusFilter("all")}
              />
              <label
                htmlFor="filter-all"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                All
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-active"
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
                checked={statusFilter === "active"}
                onCheckedChange={() => setStatusFilter("active")}
              />
              <label
                htmlFor="filter-active"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Active
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-delivered"
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
                checked={statusFilter === "delivered"}
                onCheckedChange={() => setStatusFilter("delivered")}
              />
              <label
                htmlFor="filter-delivered"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Delivered
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-cancelled"
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 w-5 h-5 rounded-md"
                checked={statusFilter === "cancelled"}
                onCheckedChange={() => setStatusFilter("cancelled")}
              />
              <label
                htmlFor="filter-cancelled"
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                Rejected/Cancelled
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 md:ml-auto w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-50">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full md:w-[140px] h-9 rounded-lg border-gray-200 text-xs font-bold bg-gray-50">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
                <SelectItem value="180">Last 6 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rows Per Page (Optional mock) */}
        <div className="flex justify-end items-center gap-2 text-xs text-gray-400 font-medium">
          <span>Rows per page:</span>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-100 text-gray-700 font-bold min-w-[40px] text-center">
            {itemsPerPage}
          </div>
        </div>

        {/* Order Cards List */}
        <div className="space-y-4">
          {currentOrders.map((order) => {
            const isRejected =
              order.OrderStatus.toLowerCase() === OrderStatus.REJECTED;
            const isDelivered =
              order.OrderStatus.toLowerCase() === OrderStatus.DELIVERED;
            const firstItem = order.items?.[0];
            const itemNames = order.items
              ?.map((i) => `${i.quantity}x ${i.name}`)
              .join(", ");
            const displayTitle = firstItem?.name || "Order";

            return (
              <Card
                key={order.orderId}
                className={`border-none shadow-sm rounded-3xl overflow-hidden transition-all hover:shadow-md ${isRejected ? "bg-red-50" : "bg-white"}`}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row items-center p-5 gap-6">
                    {/* Left: Image & Info */}
                    <div className="flex items-center gap-4 w-full md:w-[35%]">
                      <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-100 overflow-hidden relative">
                        {/* Using first item image as order thumbnail */}
                        {firstItem?.image ? (
                          <Image
                            src={getImageUrl(firstItem.image)}
                            alt={firstItem.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-gray-300">
                            <Search size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-excep font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-1">
                          {/* Ideally Restaurant Name here */}
                          {displayTitle}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                          {order.orderId} • {order.orderDate}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Items Summary */}
                    <div className="hidden md:block w-[30%]">
                      <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                        {itemNames}
                      </p>
                    </div>

                    {/* Right: Status & Actions */}
                    <div className="flex items-center justify-end gap-6 w-full md:w-[35%] ml-auto">
                      {/* Status Badge */}
                      <div
                        className={`
                                        px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider
                                        ${getStatusColor(order.OrderStatus)}
                                    `}
                      >
                        {isDelivered && <span>✓</span>}
                        {isRejected && <span>✕</span>}
                        {getStatusLabel(order.OrderStatus)}
                      </div>

                      {/* Price */}
                      <span className="font-semibold text-gray-900 text-sm w-[60px] text-right">
                        ${parseFloat(order.totalAmount).toFixed(2)}
                      </span>

                      {/* Action Button */}
                      {isRejected ? (
                        <Button
                          variant="outline"
                          className="rounded-full h-9 px-5 bg-white border-gray-200 text-gray-600 text-[11px] font-bold hover:bg-gray-50"
                        >
                          Help
                        </Button>
                      ) : (
                        <Button className="rounded-full h-9 px-5 bg-[#2E5C46] hover:bg-[#234535] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                          <RefreshCw size={12} />
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {filteredOrders.length > 0 && (
          <div className="flex justify-center pt-4">
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`cursor-pointer border-none text-gray-400 hover:text-gray-600 hover:bg-transparent ${currentPage === 1 ? "pointer-events-none opacity-30" : ""}`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className={`w-8 h-8 rounded-full text-xs font-bold border-none cursor-pointer ${
                          currentPage === page
                            ? "bg-emerald-bg text-white hover:bg-emerald-bg"
                            : "text-gray-500 hover:bg-gray-100"
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
                    className={`cursor-pointer border-none text-gray-400 hover:text-gray-600 hover:bg-transparent ${currentPage === totalPages ? "pointer-events-none opacity-30" : ""}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
