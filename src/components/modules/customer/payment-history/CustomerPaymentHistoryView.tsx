"use client";

import { useState, useEffect } from "react";
import {
  FileDown,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { generateInvoicePDF } from "@/utils/InvoicePDF";
import Image from "next/image";

import { PaymentHistorySkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

import { PaymentHistorySkeleton } from "@/components/skeletons/CustomerDashboardSkeleton";

export default function CustomerPaymentHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

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

  if (loading) return <PaymentHistorySkeleton />;

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  // ...



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
    }
  };

  const columns: Column<any>[] = [
    {
      header: "Item",
      cell: (order) => {
        const firstItemImage =
          order.items && order.items.length > 0 ? order.items[0].image : null;
        const imageUrl = firstItemImage
          ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${firstItemImage.replace(/\\/g, "/")}`
          : null;
        return (
          <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <Image
                width={250}
                height={250}
                src={imageUrl}
                alt="Item"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold text-gray-400">IMG</span>
            )}
          </div>
        );
      },
      headerClassName: "w-[80px]",
    },
    {
      header: "Transaction ID",
      headerClassName: "w-[200px]",
      cell: (order) => (
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-full ${order.status === "paid" || order.status === "delivered"
              ? "bg-emerald-100 text-emerald-600"
              : "bg-yellow-100 text-yellow-600"
              }`}
          >
            {order.status === "paid" || order.status === "delivered" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownLeft size={14} />
            )}
          </div>
          <span className="font-mono text-xs text-gray-600">
            #{order.orderId.substring(0, 8)}...
          </span>
        </div>
      ),
    },
    {
      header: "Date & Time",
      cell: (order) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">
            {order.orderDate}
          </span>
          <span className="text-xs text-gray-500">{order.orderTime}</span>
        </div>
      ),
    },
    {
      header: "Payment Method",
      cell: (order) => {
        const isCard = order.paymentMethod === "card";
        const paymentLabel = isCard ? "Credit Card" : "Cash on Delivery";
        const PaymentIcon = isCard ? CreditCard : Banknote;
        return (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <PaymentIcon size={16} className="text-gray-400" />
            <span>{paymentLabel}</span>
          </div>
        );
      },
    },
    {
      header: "Amount",
      cell: (order) => (
        <span className="font-bold text-gray-900">${order.totalAmount}</span>
      ),
    },
    {
      header: "Status",
      cell: (order) => (
        <Badge
          className={`rounded-full px-3 font-bold text-[10px] uppercase ${order.status === "delivered" || order.status === "paid"
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none"
            : order.status === "pending"
              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none"
              : "bg-gray-100 text-gray-600 border-none"
            }`}
        >
          {order.status}
        </Badge>
      ),
    },
    {
      header: "Invoice",
      headerClassName: "text-right",
      className: "text-right",
      cell: (order) => (
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full hover:bg-gray-100 text-emerald-600 font-medium h-8"
          onClick={(e) => {
            e.stopPropagation();
            generateInvoicePDF(order);
          }}
        >
          <FileDown size={14} className="mr-2" /> Download
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-4 md:p-6 transition-all">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div>
            <Typography
              variant="h2"
              className="text-[#111827] font-bold text-xl md:text-2xl"
            >
              Payment History
            </Typography>
            <Typography variant="small" className="text-gray-500 text-xs md:text-sm mt-0.5 md:mt-1">
              Manage your transactions and invoices
            </Typography>
          </div>
          <div className="flex gap-2.5 md:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none rounded-full border-gray-200 bg-white h-9 md:h-10 px-4 text-xs md:text-sm font-medium"
            >
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4 mr-2" /> Filter
            </Button>
          </div>
        </header>

        {/* Transactions Card */}
        <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">
              All Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <GlobalTable
              data={currentOrders}
              columns={columns}
              loading={loading}
              emptyMessage="No transactions found"
              searchParams={{
                searchTerm,
                onSearchChange: (term) => {
                  setSearchTerm(term);
                  setCurrentPage(1);
                },
                placeholder: "Search by Order ID...",
              }}
              paginationParams={{
                currentPage,
                totalPages,
                onPageChange: handlePageChange,
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
