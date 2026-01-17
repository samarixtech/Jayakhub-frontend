"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Star,
  MapPin,
  Phone,
  Search,
  Filter,
  Download,
  Printer,
  X,
  Image,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: string;
  img: string;
}

interface Order {
  id: string;
  date: string;
  status: "Delivered" | "In Progress" | "Cancelled";
  total: string;
  items: OrderItem[];
  deliveryAddress?: string;
  paymentMethod?: string;
  deliveryTime?: string;
  rider?: {
    name: string;
    phone: string;
  };
}

// Food images for variety
const foodImages = [
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=400",
];

// Restaurant names for variety
const restaurantNames = [
  "Karahi & Tikka",
  "Fredarios Pizza",
  "Eggspectation Rest.",
  "Burger Hub",
  "Sushi Master",
  "Pasta Paradise",
  "BBQ Tonight",
  "Chinese Dragon",
  "Mexican Fiesta",
  "Thai Orchid",
];

// Generate sample data for thousands of orders
const generateSampleOrders = (count: number): Order[] => {
  const statuses: Array<"Delivered" | "In Progress" | "Cancelled"> = [
    "Delivered",
    "In Progress",
    "Cancelled",
  ];

  return Array.from({ length: count }, (_, i) => {
    const itemCount = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    const items = Array.from({ length: itemCount }, (_, itemIndex) => {
      const restaurantIndex = Math.floor(
        Math.random() * restaurantNames.length
      );
      const imageIndex = Math.floor(Math.random() * foodImages.length);
      const price = Math.floor(Math.random() * 200) + 50;

      return {
        id: `item-${i}-${itemIndex}`,
        title: restaurantNames[restaurantIndex],
        quantity: Math.floor(Math.random() * 2) + 1,
        price: `₨${price}`,
        img: foodImages[imageIndex],
      };
    });

    const total = items.reduce((sum, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ""));
      return sum + price * item.quantity;
    }, 0);

    return {
      id: `ORD-${10000 + i}`,
      date: `2025-${String(Math.floor(Math.random() * 12) + 1).padStart(
        2,
        "0"
      )}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      total: `₨${total}`,
      deliveryAddress: "House 123, Street 4, Hyderabad, Sindh",
      paymentMethod:
        Math.random() > 0.5 ? "Cash on Delivery" : "Online Payment",
      deliveryTime: `${Math.floor(Math.random() * 60) + 15} mins`,
      rider:
        Math.random() > 0.3
          ? {
              name: "Ahmed Khan",
              phone: "+92 300 1234567",
            }
          : undefined,
      items,
    };
  });
};

const sampleOrders = generateSampleOrders(50); // Generate 50 sample orders

const MyOrders: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const country = (params.country as string) || "pk";
  const language = (params.language as string) || "en";

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"date" | "total">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 10;

  const t = useTranslations("myOrders");

  // Filter, sort, and paginate orders
  const { filteredOrders, totalPages, totalFilteredOrders } = useMemo(() => {
    const filtered = sampleOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus =
        filterStatus === "All" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        const aTotal = parseInt(a.total.replace(/[^\d]/g, ""));
        const bTotal = parseInt(b.total.replace(/[^\d]/g, ""));
        return sortOrder === "desc" ? bTotal - aTotal : aTotal - bTotal;
      }
    });

    // Pagination
    const totalPages = Math.ceil(filtered.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = filtered.slice(
      startIndex,
      startIndex + ordersPerPage
    );

    return {
      filteredOrders: paginatedOrders,
      totalPages,
      totalFilteredOrders: filtered.length,
    };
  }, [searchTerm, filterStatus, sortBy, sortOrder, currentPage]);

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Clock className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-[#FFF9EE] text-gray-700";
    }
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow && selectedOrder) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${selectedOrder.id}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .order-info { margin-bottom: 20px; }
              .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              .items-table th, .items-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
              .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Order Receipt</h1>
              <h2>${selectedOrder.id}</h2>
            </div>
            <div class="order-info">
              <p><strong>Date:</strong> ${selectedOrder.date}</p>
              <p><strong>Status:</strong> ${selectedOrder.status}</p>
              <p><strong>Payment Method:</strong> ${
                selectedOrder.paymentMethod
              }</p>
            </div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${selectedOrder.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.title}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="total">
              Total: ${selectedOrder.total}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // Handle image error
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src =
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
  };

  return (
    <div className="bg-gradient-to-br from-[#FFF9EE] to-[#FFF9EE] min-h-screen px-4 md:px-16 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Package className="w-9 h-9 text-[#0B5D4E]" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("header")}
          </h2>
        </div>
        <p className="text-gray-600 text-lg">{t("subheader")}</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#E8F4F1] rounded-2xl p-6 shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t("search.placeholder")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent"
          >
            <option value="All">{t("filter.all")}</option>
            <option value="In Progress">{t("filter.in_progress")}</option>
            <option value="Delivered">{t("filter.delivered")}</option>
            <option value="Cancelled">{t("filter.cancelled")}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "total")}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent"
          >
            <option value="date">{t("sort.date")}</option>
            <option value="total">{t("sort.total")}</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {sortOrder === "asc" ? t("sort.asc") : t("sort.desc")}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#E8F4F1] rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-[#FFF9EE]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t("table.order_id")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t("table.date")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t("table.status")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t("table.items")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t("table.total")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  {t("table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF9EE]">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-[#0B5D4E]">
                      {order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={item.id} className="relative">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-8 h-8 rounded-full border-2 border-[#E8F4F1] object-cover"
                              onError={handleImageError}
                            />
                            {index === 2 && order.items.length > 3 && (
                              <div className="absolute inset-0 bg-[#2C2C2C] bg-opacity-50 rounded-full flex items-center justify-center text-[#E8F4F1] text-xs">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="text-sm text-gray-900">
                        {/* FIXED: Provide the count parameter to the translation */}
                        {t("table.items_count", { count: order.items.length })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {order.total}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                      }}
                      className="text-sm text-[#0B5D4E] hover:text-[#002a47] font-medium"
                    >
                      {t("actions.view_details")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#FFF9EE] flex items-center justify-between">
            <div className="text-sm text-gray-700">
              {t("pagination.showing")} {(currentPage - 1) * ordersPerPage + 1}{" "}
              - {Math.min(currentPage * ordersPerPage, totalFilteredOrders)}{" "}
              {t("pagination.of")} {totalFilteredOrders}{" "}
              {t("pagination.orders")}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                {t("pagination.previous")}
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
              >
                {t("pagination.next")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-[#2C2C2C] bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#E8F4F1] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#FFF9EE]">
              <h3 className="text-2xl font-bold text-gray-900">
                {t("modal.order_details")} - {selectedOrder.id}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-[#FFF9EE] rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6">
                {/* Order Status & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("details.order_status")}
                      </h4>
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("details.order_date")}
                      </h4>
                      <p className="text-gray-600">{selectedOrder.date}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("details.delivery_time")}
                      </h4>
                      <p className="text-gray-600">
                        {selectedOrder.deliveryTime}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" />
                        {t("details.delivery_address")}
                      </h4>
                      <p className="text-gray-600">
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t("details.payment_method")}
                      </h4>
                      <p className="text-gray-600">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rider Info */}
                {selectedOrder.rider && (
                  <div className="bg-[#0B5D4E] p-4 rounded-xl border border-[#0B5D4E] mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {t("details.rider_details")}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {selectedOrder.rider.name}
                        </p>
                        <p className="text-gray-600 text-sm flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {selectedOrder.rider.phone}
                        </p>
                      </div>
                      <a
                        href={`tel:${selectedOrder.rider.phone.replace(
                          /\s/g,
                          ""
                        )}`}
                        className="px-5 py-2 bg-[#0B5D4E] text-[#E8F4F1] rounded-lg text-sm hover:bg-[#002a47] transition"
                      >
                        {t("actions.call_rider")}
                      </a>
                    </div>
                  </div>
                )}

                {/* Receipt with Food Images - FIXED: Removed duplicate quantity display */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {t("details.receipt")}
                  </h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-3 border-b border-[#FFF9EE] last:border-b-0"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover border border-[#FFF9EE]"
                              onError={handleImageError}
                            />
                            <div className="absolute -top-2 -right-2 bg-[#0B5D4E] text-[#E8F4F1] text-xs rounded-full w-6 h-6 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.title}
                            </p>
                            {/* REMOVED: Duplicate quantity display line */}
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900 text-lg">
                          {item.price}
                        </p>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                      <span className="text-lg font-semibold text-gray-900">
                        {t("receipt.total")}
                      </span>
                      <span className="text-xl font-bold text-[#0B5D4E]">
                        {selectedOrder.total}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Compact Version */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-[#FFF9EE] bg-gray-50">
              {/* Left side - Print and Download buttons */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <button
                  onClick={handlePrintReceipt}
                  className="flex items-center gap-2 px-3 py-2 bg-[#E8F4F1] border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-[#FFF9EE] transition text-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-[#E8F4F1] border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-[#FFF9EE] transition text-sm">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>

              {/* Right side - Action buttons */}
              <div className="flex gap-2 justify-center sm:justify-end">
                {selectedOrder.status === "Delivered" && (
                  <button className="px-3 py-2 bg-[#0B5D4E] text-[#E8F4F1] rounded-lg font-medium hover:bg-[#002a47] transition text-sm">
                    Reorder
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="px-3 py-2 bg-[#E8F4F1] border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-[#FFF9EE] transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
