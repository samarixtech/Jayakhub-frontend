"use client";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Search,
  Filter,
  ChevronDown,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  LucideIcon,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect } from "react";

// Type definitions
interface FilterOption {
  value: string;
  label: string;
  count: number;
}

interface PaymentStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
  trend: "up" | "down";
}

interface Payment {
  id: string;
  type: "food" | "subscription" | "refund" | "topup";
  description: string;
  date: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  method: string;
  icon: LucideIcon;
  receiptAvailable: boolean;
}

export default function PaymentHistoryPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] =
    useState<boolean>(false);
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(5);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  const statusFilterOptions: FilterOption[] = [
    { value: "all", label: "All Statuses", count: 12 },
    { value: "completed", label: "Completed", count: 8 },
    { value: "pending", label: "Pending", count: 2 },
    { value: "failed", label: "Failed", count: 2 },
  ];

  const typeFilterOptions: FilterOption[] = [
    { value: "all", label: "All Types", count: 12 },
    { value: "food", label: "Food Delivery", count: 6 },
    { value: "subscription", label: "Subscription", count: 3 },
    { value: "refund", label: "Refund", count: 2 },
    { value: "topup", label: "Wallet Top-up", count: 1 },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setIsStatusDropdownOpen(false);
      }
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const paymentStats: PaymentStat[] = [
    {
      label: "Total Spent",
      value: "$1,248.75",
      icon: DollarSign,
      color: "text-[#0B5D4E]",
      change: "+12%",
      trend: "up",
    },
    {
      label: "This Month",
      value: "$286.50",
      icon: Calendar,
      color: "text-green-600",
      change: "+5%",
      trend: "up",
    },
    {
      label: "Pending Payments",
      value: "$45.25",
      icon: Clock,
      color: "text-amber-600",
      change: "-2%",
      trend: "down",
    },
    {
      label: "Failed Payments",
      value: "$89.99",
      icon: AlertCircle,
      color: "text-red-600",
      change: "+1%",
      trend: "up",
    },
  ];

  const paymentHistory: Payment[] = [
    {
      id: "PAY-9921",
      type: "food",
      description: "Sushi Master • Order #ORD-9921",
      date: "Nov 15, 2025 • 7:30 PM",
      amount: "$42.50",
      status: "completed",
      method: "•••• 4242",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9920",
      type: "subscription",
      description: "Monthly Premium Subscription",
      date: "Nov 14, 2025 • 12:00 PM",
      amount: "$9.99",
      status: "completed",
      method: "•••• 4242",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9919",
      type: "food",
      description: "Burger & Co. • Order #ORD-8820",
      date: "Oct 24, 2025 • 8:30 PM",
      amount: "$28.00",
      status: "completed",
      method: "PayPal",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9918",
      type: "refund",
      description: "Refund: Green Bowl Salad",
      date: "Oct 18, 2025 • 2:15 PM",
      amount: "-$22.00",
      status: "completed",
      method: "•••• 4242",
      icon: CreditCard,
      receiptAvailable: false,
    },
    {
      id: "PAY-9917",
      type: "food",
      description: "Pizza Paradiso • Order #ORD-8819",
      date: "Oct 20, 2025 • 1:15 PM",
      amount: "$35.50",
      status: "completed",
      method: "•••• 4242",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9916",
      type: "topup",
      description: "Wallet Top-up",
      date: "Oct 18, 2025 • 10:30 AM",
      amount: "$50.00",
      status: "completed",
      method: "Bank Transfer",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9915",
      type: "food",
      description: "Thai Orchid • Order #ORD-8817",
      date: "Oct 15, 2025 • 7:30 PM",
      amount: "$38.50",
      status: "completed",
      method: "Google Pay",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9914",
      type: "subscription",
      description: "Monthly Premium Subscription",
      date: "Oct 14, 2025 • 12:00 PM",
      amount: "$9.99",
      status: "pending",
      method: "•••• 4242",
      icon: Clock,
      receiptAvailable: false,
    },
    {
      id: "PAY-9913",
      type: "food",
      description: "Burrito Express • Order #ORD-8816",
      date: "Oct 12, 2025 • 6:15 PM",
      amount: "$26.75",
      status: "failed",
      method: "•••• 4242",
      icon: XCircle,
      receiptAvailable: false,
    },
    {
      id: "PAY-9912",
      type: "food",
      description: "Ramen House • Order #ORD-8815",
      date: "Oct 10, 2025 • 12:30 PM",
      amount: "$34.00",
      status: "completed",
      method: "Apple Pay",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9911",
      type: "subscription",
      description: "Monthly Premium Subscription",
      date: "Sep 14, 2025 • 12:00 PM",
      amount: "$9.99",
      status: "completed",
      method: "•••• 4242",
      icon: CreditCard,
      receiptAvailable: true,
    },
    {
      id: "PAY-9910",
      type: "food",
      description: "Burger & Co. • Order #ORD-7814",
      date: "Sep 12, 2025 • 7:45 PM",
      amount: "$32.25",
      status: "failed",
      method: "PayPal",
      icon: XCircle,
      receiptAvailable: false,
    },
  ];

  const filteredPayments = useMemo(() => {
    return paymentHistory.filter((payment: Payment) => {
      const matchesSearch =
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      const matchesType = typeFilter === "all" || payment.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredPayments.length / ordersPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

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

  const getStatusIcon = (status: string): LucideIcon => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return XCircle;
      default:
        return CreditCard;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-[#FFF9EE] text-gray-700";
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "food":
        return "text-[#0B5D4E] bg-[#0B5D4E]";
      case "subscription":
        return "text-purple-600 bg-purple-50";
      case "refund":
        return "text-green-600 bg-green-50";
      case "topup":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case "food":
        return "Food Delivery";
      case "subscription":
        return "Subscription";
      case "refund":
        return "Refund";
      case "topup":
        return "Top-up";
      default:
        return type;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setIsStatusDropdownOpen(false);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setIsTypeDropdownOpen(false);
  };

  return (
    <main
      className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8"
      aria-labelledby="page-title"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 space-y-6 sm:space-y-8">
        {/* Header Section */}
        <header className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <h1
              id="page-title"
              className="text-xl sm:text-2xl font-semibold text-gray-900"
            >
              Payment History
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage your payment transactions
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-4xl mx-auto w-full">
            <div className="relative flex-1 min-w-0">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-[#E8F4F1] border border-[#FFF9EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent text-sm sm:text-base"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-auto" ref={statusDropdownRef}>
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full sm:w-auto pl-10 pr-10 py-2 sm:py-3 bg-[#E8F4F1] border border-[#FFF9EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-all min-w-[140px] sm:min-w-[180px]"
              >
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <span className="flex-1 text-left text-gray-700 font-medium text-sm sm:text-base truncate">
                  {
                    statusFilterOptions.find(
                      (opt) => opt.value === statusFilter
                    )?.label
                  }
                </span>
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 ${
                    isStatusDropdownOpen ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>

              <div
                className={`absolute top-full mt-1 w-full bg-[#E8F4F1] border border-[#FFF9EE] rounded-lg shadow-lg overflow-hidden z-10 transition-all duration-300 origin-top ${
                  isStatusDropdownOpen
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {statusFilterOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusFilterChange(option.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between hover:bg-[#0B5D4E] transition-colors group ${
                      index !== statusFilterOptions.length - 1
                        ? "border-b border-[#FFF9EE]"
                        : ""
                    } ${statusFilter === option.value ? "bg-[#0B5D4E]" : ""}`}
                    style={{
                      transitionDelay: isStatusDropdownOpen
                        ? `${index * 50}ms`
                        : "0ms",
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all ${
                          statusFilter === option.value
                            ? "border-[#0B5D4E] bg-[#0B5D4E]"
                            : "border-gray-300 group-hover:border-yellow-400"
                        }`}
                      >
                        {statusFilter === option.value && (
                          <Check
                            size={12}
                            className="text-[#E8F4F1]"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={`font-medium transition-colors text-sm sm:text-base ${
                          statusFilter === option.value
                            ? "text-[#0B5D4E]"
                            : "text-gray-700 group-hover:text-[#B6932F]"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-all ${
                        statusFilter === option.value
                          ? "bg-yellow-200 text-[#0B5D4E]"
                          : "bg-[#FFF9EE] text-gray-600 group-hover:bg-[#0B5D4E] group-hover:text-[#B6932F]"
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter Dropdown */}
            <div className="relative w-full sm:w-auto" ref={typeDropdownRef}>
              <button
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                className="w-full sm:w-auto pl-10 pr-10 py-2 sm:py-3 bg-[#E8F4F1] border border-[#FFF9EE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-transparent cursor-pointer flex items-center gap-2 hover:bg-gray-50 transition-all min-w-[140px] sm:min-w-[180px]"
              >
                <Filter
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <span className="flex-1 text-left text-gray-700 font-medium text-sm sm:text-base truncate">
                  {
                    typeFilterOptions.find((opt) => opt.value === typeFilter)
                      ?.label
                  }
                </span>
                <ChevronDown
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-300 ${
                    isTypeDropdownOpen ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>

              <div
                className={`absolute top-full mt-1 w-full bg-[#E8F4F1] border border-[#FFF9EE] rounded-lg shadow-lg overflow-hidden z-10 transition-all duration-300 origin-top ${
                  isTypeDropdownOpen
                    ? "opacity-100 scale-y-100 translate-y-0"
                    : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
                }`}
              >
                {typeFilterOptions.map((option, index) => (
                  <button
                    key={option.value}
                    onClick={() => handleTypeFilterChange(option.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left flex items-center justify-between hover:bg-[#0B5D4E] transition-colors group ${
                      index !== typeFilterOptions.length - 1
                        ? "border-b border-[#FFF9EE]"
                        : ""
                    } ${typeFilter === option.value ? "bg-[#0B5D4E]" : ""}`}
                    style={{
                      transitionDelay: isTypeDropdownOpen
                        ? `${index * 50}ms`
                        : "0ms",
                    }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all ${
                          typeFilter === option.value
                            ? "border-[#0B5D4E] bg-[#0B5D4E]"
                            : "border-gray-300 group-hover:border-yellow-400"
                        }`}
                      >
                        {typeFilter === option.value && (
                          <Check
                            size={12}
                            className="text-[#E8F4F1]"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={`font-medium transition-colors text-sm sm:text-base ${
                          typeFilter === option.value
                            ? "text-[#0B5D4E]"
                            : "text-gray-700 group-hover:text-[#B6932F]"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    <span
                      className={`text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-all ${
                        typeFilter === option.value
                          ? "bg-yellow-200 text-[#0B5D4E]"
                          : "bg-[#FFF9EE] text-gray-600 group-hover:bg-[#0B5D4E] group-hover:text-[#B6932F]"
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

        {/* Payment Statistics Section */}
        <section aria-label="Payment statistics">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {paymentStats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#E8F4F1] rounded-lg border border-[#FFF9EE] p-3 sm:p-4"
              >
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div
                    className={`inline-flex p-1.5 sm:p-2 rounded-lg bg-gray-50 ${stat.color}`}
                  >
                    <stat.icon size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
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

        {/* Payment History Section */}
        <section
          aria-labelledby="payment-history-heading"
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2
                id="payment-history-heading"
                className="text-lg font-semibold text-gray-900"
              >
                Transaction History
              </h2>
              <p className="text-gray-600 text-sm">
                Showing {indexOfFirstOrder + 1}-
                {Math.min(indexOfLastOrder, filteredPayments.length)} of{" "}
                {filteredPayments.length} transaction
                {filteredPayments.length !== 1 ? "s" : ""}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-[#0B5D4E] hover:text-[#B6932F] text-sm font-medium self-start sm:self-auto"
              >
                Clear search
              </button>
            )}
          </div>

          {currentPayments.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-[#E8F4F1] rounded-xl border border-[#FFF9EE]">
              <Search
                className="mx-auto text-gray-400 mb-2 sm:mb-3"
                size={28}
              />
              <div className="text-gray-900 font-medium mb-1 text-sm sm:text-base">
                No transactions found
              </div>
              <div className="text-gray-600 text-xs sm:text-sm">
                {searchQuery
                  ? "Try different search terms"
                  : "No payment history yet"}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {currentPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                const PaymentIcon = payment.icon;

                return (
                  <div
                    key={payment.id}
                    className="bg-[#E8F4F1] rounded-xl border border-[#FFF9EE] p-4 sm:p-5 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <div
                          className={`p-2 sm:p-3 rounded-lg ${getTypeColor(
                            payment.type
                          )} shrink-0`}
                        >
                          <PaymentIcon size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                              {payment.description}
                            </h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${getTypeColor(
                                payment.type
                              )} self-start sm:self-auto shrink-0`}
                            >
                              {getTypeLabel(payment.type)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <time>{payment.date}</time>
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard size={12} />
                              <span className="truncate">{payment.method}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <StatusIcon size={12} />
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                                  payment.status
                                )} shrink-0`}
                              >
                                {payment.status.charAt(0).toUpperCase() +
                                  payment.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end gap-2 sm:gap-3 lg:gap-2 lg:text-right">
                        <div
                          className={`text-base sm:text-lg font-semibold ${
                            payment.amount.startsWith("-")
                              ? "text-green-600"
                              : "text-gray-900"
                          }`}
                        >
                          {payment.amount}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 justify-start sm:justify-end">
                          {payment.receiptAvailable && (
                            <button className="px-2 sm:px-3 py-1.5 sm:py-2 bg-[#0B5D4E] text-[#E8F4F1] rounded-lg hover:bg-[#0B5D4E] transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 shrink-0">
                              <Download size={12} />
                              <span className="hidden xs:inline">Receipt</span>
                            </button>
                          )}
                          <button className="px-2 sm:px-3 py-1.5 sm:py-2 bg-[#E8F4F1] text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-[#FFF9EE] text-xs sm:text-sm font-medium flex items-center gap-1 shrink-0">
                            <span className="hidden xs:inline">Details</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredPayments.length > ordersPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-[#FFF9EE]">
              <div className="text-sm text-gray-700 order-2 sm:order-1">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-[#FFF9EE] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="First page"
                >
                  <ChevronsLeft size={14} />
                </button>

                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg border border-[#FFF9EE] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                          ? "bg-[#0B5D4E] text-[#E8F4F1] border-[#0B5D4E]"
                          : "border-[#FFF9EE] hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg border border-[#FFF9EE] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight size={14} />
                </button>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg border border-[#FFF9EE] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
  );
}
