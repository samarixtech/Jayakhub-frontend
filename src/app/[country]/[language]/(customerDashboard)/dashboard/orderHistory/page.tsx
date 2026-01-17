"use client";
import {
  ShoppingBag,
  MapPin,
  Clock,
  Star,
  RefreshCw,
  ChevronRight,
  Receipt,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ChevronDown,
  Check,
  LucideIcon,
  X, // Added X for modal closure (though it's used in the modal itself)
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";
// Import the new modal component
import OrderDetailsModal from "@/components/OrderDetailsModal";

// Type definitions (Keep these)
interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface OrderStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface ActiveOrder {
  id: string;
  restaurant: string;
  image: string;
  items: string;
  total: string;
  status: string;
  eta: string;
  driver: string;
  progress: number;
}

interface PastOrder {
  id: string;
  restaurant: string;
  image: string;
  date: string;
  items: string;
  total: string;
  status: "Delivered" | "Cancelled" | "On the way";
  rating: number;
}

export default function FoodOrdersPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(2);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // New state for the modal: holds the details of the order to display
  const [selectedOrder, setSelectedOrder] = useState<PastOrder | null>(null);

  const filterOptions: FilterOption[] = [
    { value: "all", label: "All Orders", count: 6 },
    { value: "delivered", label: "Delivered", count: 5 },
    { value: "cancelled", label: "Cancelled", count: 1 },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Order Data (Kept as is) ---
  const activeOrder: ActiveOrder = {
    id: "ORD-9921",
    restaurant: "Sushi Master",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=300&auto=format&fit=crop",
    items: "2x Spicy Tuna Roll, 1x Miso Soup, 1x Edamame",
    total: "$42.50",
    status: "On the way",
    eta: "15-20 min",
    driver: "Michael D.",
    progress: 75,
  };

  const pastOrders: PastOrder[] = [
    {
      id: "ORD-8820",
      restaurant: "Burger & Co.",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300&auto=format&fit=crop",
      date: "Oct 24, 2025 • 8:30 PM",
      items: "1x Double Cheeseburger, 1x Large Fries, 1x Vanilla Shake",
      total: "$28.00",
      status: "Delivered",
      rating: 5,
    },
    {
      id: "ORD-8819",
      restaurant: "Pizza Paradiso",
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=300&auto=format&fit=crop",
      date: "Oct 20, 2025 • 1:15 PM",
      items: "1x Pepperoni Feast (Large), 1x Garlic Knots",
      total: "$35.50",
      status: "Delivered",
      rating: 4,
    },
    {
      id: "ORD-8818",
      restaurant: "Green Bowl Salad",
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit:crop",
      date: "Oct 18, 2025 • 12:45 PM",
      items: "1x Caesar Salad, 1x Chicken Protein Bowl",
      total: "$22.00",
      status: "Cancelled",
      rating: 0,
    },
    {
      id: "ORD-8817",
      restaurant: "Thai Orchid",
      image:
        "https://images.unsplash.com/photo-1559314809-0f155186a14c?q=80&w=300&auto=format&fit=crop",
      date: "Oct 15, 2025 • 7:30 PM",
      items: "1x Pad Thai, 1x Green Curry, 2x Spring Rolls",
      total: "$38.50",
      status: "Delivered",
      rating: 5,
    },
    {
      id: "ORD-8816",
      restaurant: "Burrito Express",
      image:
        "https://images.unsplash.com/photo-1519183073328-330cc6ead67e?q=80&w=300&auto=format&fit=crop",
      date: "Oct 12, 2025 • 6:15 PM",
      items: "2x Chicken Burritos, 1x Chips & Guacamole",
      total: "$26.75",
      status: "Delivered",
      rating: 4,
    },
    {
      id: "ORD-8815",
      restaurant: "Ramen House",
      image:
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=300&auto=format&fit=crop",
      date: "Oct 10, 2025 • 12:30 PM",
      items: "2x Tonkotsu Ramen, 1x Gyoza",
      total: "$34.00",
      status: "Delivered",
      rating: 5,
    },
  ];
  // --- End Order Data ---

  const filteredOrders = useMemo(() => {
    return pastOrders.filter((order: PastOrder) => {
      const matchesSearch =
        order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const getPageNumbers = (): number[] => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = maxPagesToShow;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setIsDropdownOpen(false);
  };

  // New function to handle order click and open the modal
  const handleOrderClick = (order: PastOrder) => {
    setSelectedOrder(order);
  };

  // New function to close the modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const orderStats: OrderStat[] = [
    {
      label: "Total Orders",
      value: pastOrders.length.toString(),
      icon: ShoppingBag,
      color: "text-[#0B5D4E]",
    },
    {
      label: "Total Spent",
      value: "$480",
      icon: Receipt,
      color: "text-green-600",
    },
    {
      label: "Favorite Spot",
      value: "Burger & Co.",
      icon: MapPin,
      color: "text-red-600",
    },
    {
      label: "Avg Rating",
      value: "4.8",
      icon: Star,
      color: "text-amber-600",
    },
  ];

  return (
    <>
      <main
        className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8"
        aria-labelledby="page-title"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 space-y-6 sm:space-y-8">
          {/* Header Section */}
          <header className="text-center space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h1
                id="page-title"
                className="text-xl sm:text-2xl font-semibold text-gray-900"
              >
                Order History
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track and manage your food orders
              </p>
            </div>

            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto w-full">
              <div className="relative flex-1 min-w-0">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={handleSearchChange} //bg-[#0B5D4E]
                  className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="relative w-full sm:w-auto" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full sm:w-auto pl-10 pr-10 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-all min-w-[140px] sm:min-w-[180px]"
                >
                  <Filter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <span className="flex-1 text-left text-gray-700 font-medium text-sm sm:text-base truncate">
                    {
                      filterOptions.find((opt) => opt.value === statusFilter)
                        ?.label
                    }
                  </span>
                  <ChevronDown
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>

                <div
                  className={`absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10 transition-all duration-300 origin-top ${
                    isDropdownOpen
                      ? "opacity-100 scale-y-100 translate-y-0"
                      : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {filterOptions.map((option, index) => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterChange(option.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between hover:bg-green-50 transition-colors group ${
                        index !== filterOptions.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      } ${statusFilter === option.value ? "bg-green-50" : ""}`}
                      style={{
                        transitionDelay: isDropdownOpen
                          ? `${index * 50}ms`
                          : "0ms",
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all ${
                            statusFilter === option.value
                              ? "border-[#0B5D4E] bg-[#0B5D4E]"
                              : "border-gray-300 group-hover:border-[#0B5D4E]"
                          }`}
                        >
                          {statusFilter === option.value && (
                            <Check
                              size={12}
                              className="text-white"
                              strokeWidth={3}
                            />
                          )}
                        </div>
                        <span
                          className={`font-medium transition-colors text-sm sm:text-base ${
                            statusFilter === option.value
                              ? "text-[#0B5D4E]"
                              : "text-gray-700 group-hover:text-[#0B5D4E]"
                          }`}
                        >
                          {option.label}
                        </span>
                      </div>
                      <span
                        className={`text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-all ${
                          statusFilter === option.value
                            ? "bg-green-100 text-[#0B5D4E]"
                            : "bg-green-100 text-gray-600 group-hover:bg-green-100 group-hover:text-[#0B5D4E]"
                        }`}
                      >
                        {option.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Active Order Section */}
          <section aria-labelledby="active-order-heading">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src={activeOrder.image}
                  alt={`Order from ${activeOrder.restaurant}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover self-start"
                />

                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2
                        id="active-order-heading"
                        className="text-lg font-semibold text-gray-900 truncate"
                      >
                        {activeOrder.restaurant}
                      </h2>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {activeOrder.items}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {activeOrder.total}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[#0B5D4E] mt-1">
                        <Clock size={14} />
                        <span>ETA: {activeOrder.eta}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                      <span>Preparing</span>
                      <span>On the way</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B5D4E] rounded-full transition-all duration-500"
                        style={{ width: `${activeOrder.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order Statistics Section (Unchanged) */}
          <section aria-label="Order statistics">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {orderStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 text-center"
                >
                  <div
                    className={`inline-flex p-1.5 sm:p-2 rounded-lg bg-gray-50 ${stat.color} mb-1 sm:mb-2`}
                  >
                    <stat.icon size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Past Orders Section (Modified to include click handler) */}
          <section aria-labelledby="past-orders-heading" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2
                  id="past-orders-heading"
                  className="text-lg font-semibold text-gray-900"
                >
                  Past Orders
                </h2>
                <p className="text-gray-600 text-sm">
                  Showing {indexOfFirstOrder + 1}-
                  {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
                  {filteredOrders.length} order
                  {filteredOrders.length !== 1 ? "s" : ""}
                </p>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-green-700 hover:text-[#0B5D4E] text-sm font-medium self-start sm:self-auto"
                >
                  Clear search
                </button>
              )}
            </div>

            {currentOrders.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl border border-gray-200">
                <Search
                  className="mx-auto text-gray-400 mb-2 sm:mb-3"
                  size={28}
                />
                <div className="text-gray-900 font-medium mb-1 text-sm sm:text-base">
                  No orders found
                </div>
                <div className="text-gray-600 text-xs sm:text-sm">
                  {searchQuery
                    ? "Try different search terms"
                    : "No past orders yet"}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {currentOrders.map((order) => (
                  <div
                    key={order.id}
                    // Added onClick handler here
                    onClick={() => handleOrderClick(order)}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <img
                        src={order.image}
                        alt={`Meal from ${order.restaurant}`}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                      />

                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {order.restaurant}
                            </h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mt-0.5">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} />
                                <time>{order.date}</time>
                              </div>
                              <span
                                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-base sm:text-lg font-semibold text-gray-900">
                            {order.total}
                          </div>
                        </div>

                        <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">
                          {order.items}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                          {order.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  fill={
                                    i < order.rating ? "currentColor" : "none"
                                  }
                                  className={
                                    i < order.rating
                                      ? "text-amber-500"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs sm:text-sm">
                              No rating
                            </span>
                          )}

                          <div
                            className="flex gap-1 sm:gap-2 self-end sm:self-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button className="px-2 sm:px-3 py-1.5 sm:py-2 bg-green-700 text-white rounded-lg hover:bg-[#0B5D4E] transition-colors text-xs sm:text-sm font-medium flex items-center gap-1">
                              <RefreshCw size={12} />
                              <span className="hidden xs:inline">Reorder</span>
                            </button>
                            <button
                              onClick={() => handleOrderClick(order)}
                              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 text-xs sm:text-sm font-medium flex items-center gap-1"
                            >
                              <span className="hidden xs:inline">Details</span>
                              <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > ordersPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-700 order-2 sm:order-1">
                  Page {currentPage} of {totalPages}
                </div>

                <div className="flex items-center gap-1 order-1 sm:order-2">
                  <button
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="First page"
                  >
                    <ChevronsLeft size={14} />
                  </button>

                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="p-1.5 sm:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <div className="flex items-center gap-1 mx-1 sm:mx-2">
                    {getPageNumbers().map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`min-w-8 sm:min-w-10 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border transition-colors text-xs sm:text-sm ${
                          currentPage === pageNumber
                            ? "bg-[#0B5D4E] text-white border-[#0B5D4E]"
                            : "border-gray-200 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="p-1.5 sm:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight size={14} />
                  </button>

                  <button
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="p-1.5 sm:p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Last page"
                  >
                    <ChevronsRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* The reusable Modal component */}
      <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
    </>
  );
}
