"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Clock,
  Utensils,
  User,
  CheckCircle,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  IndianRupee,
  History,
  Tag,
} from "lucide-react";

// --- Type Definitions ---
type OrderStatus = "Completed" | "Cancelled";
type SortKey = "id" | "customerName" | "restaurantName" | "totalPrice" | "orderTime" | "itemsCount";

interface OrderType {
  id: number;
  customerName: string;
  restaurantName: string;
  itemsCount: number;
  totalPrice: number;
  status: OrderStatus;
  orderTime: string;
}

// --- Sample Data (Unchanged) ---
const sampleOrders: OrderType[] = [
  { id: 201, customerName: "Rahul Sharma", restaurantName: "Royal Biryani House", itemsCount: 4, totalPrice: 1200, status: "Completed", orderTime: "2025-11-26T19:45:00" },
  { id: 202, customerName: "Anil Verma", restaurantName: "Spicy Tandoor", itemsCount: 5, totalPrice: 1100, status: "Cancelled", orderTime: "2025-11-25T18:30:00" },
  { id: 203, customerName: "Vikram Jha", restaurantName: "Italiano Kitchen", itemsCount: 6, totalPrice: 1850, status: "Completed", orderTime: "2025-11-26T12:00:00" },
  { id: 204, customerName: "Rajesh Soni", restaurantName: "Burger Hub", itemsCount: 1, totalPrice: 250, status: "Cancelled", orderTime: "2025-11-26T15:10:00" },
  { id: 205, customerName: "Priya Das", restaurantName: "Green Vegan Deli", itemsCount: 3, totalPrice: 900, status: "Completed", orderTime: "2025-11-24T17:20:00" },
  { id: 206, customerName: "Mohit Gupta", restaurantName: "Sushi Express", itemsCount: 2, totalPrice: 750, status: "Completed", orderTime: "2025-11-23T20:00:00" },
  { id: 207, customerName: "Sheena Malik", restaurantName: "Street Wok", itemsCount: 1, totalPrice: 350, status: "Completed", orderTime: "2025-11-22T11:40:00" },
  { id: 208, customerName: "Karan Singh", restaurantName: "Royal Biryani House", itemsCount: 5, totalPrice: 1500, status: "Completed", orderTime: "2025-11-21T16:15:00" },
  { id: 209, customerName: "Tanya Aggarwal", restaurantName: "Italiano Kitchen", itemsCount: 2, totalPrice: 500, status: "Cancelled", orderTime: "2025-11-20T14:05:00" },
  { id: 210, customerName: "Deepak Rawat", restaurantName: "Spicy Tandoor", itemsCount: 7, totalPrice: 2500, status: "Completed", orderTime: "2025-11-19T21:30:00" },
];

// --- Utility Components ---

/**
 * StatusBadge Component (Updated for Light Mode/Indigo Accent)
 */
function StatusBadge({ status }: { status: OrderStatus }) {
  let bgColor: string, textColor: string, icon: React.ReactNode;

  switch (status) {
    case "Completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <CheckCircle className="text-green-600 w-4 h-4" />;
      break;
    case "Cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircle className="text-red-600 w-4 h-4" />;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold [#E8F4F1]space-nowrap border border-opacity-30 ${bgColor} ${textColor}`}
      aria-label={`${status} status`}
    >
      {icon}
      {status}
    </span>
  );
}

/**
 * SortIndicator Component (Updated for Light Mode/Indigo Accent)
 */
const SortIndicator: React.FC<{ isSorted: boolean; direction: "asc" | "desc" }> = ({
  isSorted,
  direction,
}) => {
  if (!isSorted) {
    return null;
  }
  return direction === "asc" ? (
    <ArrowUp className="inline ml-1 w-4 h-4 text-indigo-100" />
  ) : (
    <ArrowDown className="inline ml-1 w-4 h-4 text-indigo-100" />
  );
}

/**
 * Formats a timestamp into a readable date/time string.
 */
const formatOrderTime = (isoString: string): string => {
    const orderDate = new Date(isoString);
    return orderDate.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
};

/**
 * Formats a number into Indian Rupee currency.
 */
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

/**
 * Single Order Card Component (Soft Indigo Theme)
 */
const OrderCard = ({ order, onViewDetails }: { order: OrderType, onViewDetails: (order: OrderType) => void }) => {
    return (
        <div 
            className="bg-[#E8F4F1] p-5 rounded-xl border border-[#FFF9EE] shadow-lg hover:shadow-xl hover:shadow-indigo-100 transition duration-300 transform hover:scale-[1.01] cursor-pointer"
            onClick={() => onViewDetails(order)}
            tabIndex={0}
            role="listitem"
        >
            <div className="flex justify-between items-start border-b border-[#FFF9EE] pb-3 mb-3">
                <div className="font-mono text-xl font-bold text-indigo-600">
                    <span className="text-gray-400 mr-1">ID</span>#{order.id}
                </div>
                <StatusBadge status={order.status} />
            </div>

            <div className="space-y-3">
                {/* Customer */}
                <p className="flex items-center text-sm">
                    <User className="text-gray-500 w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-gray-500 font-medium mr-1">Customer:</span>
                    <span className="text-gray-800 font-semibold truncate">{order.customerName}</span>
                </p>
                {/* Restaurant */}
                <p className="flex items-center text-sm">
                    <Utensils className="text-gray-500 w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-gray-500 font-medium mr-1">Venue:</span>
                    <span className="text-gray-800 font-semibold truncate">{order.restaurantName}</span>
                </p>
                {/* Items & Time Grid */}
                <div className="grid grid-cols-2 gap-y-3 pt-2 border-t border-[#FFF9EE]">
                    <p className="flex items-center text-xs">
                        <Tag className="text-indigo-500 w-3 h-3 mr-1" />
                        <span className="text-gray-500 mr-1">Items:</span>
                        <span className="text-indigo-600 font-bold">{order.itemsCount}</span>
                    </p>
                    <p className="flex items-center text-xs justify-end">
                        <Clock className="text-indigo-500 w-3 h-3 mr-1" />
                        <span className="text-gray-500 mr-1">Date:</span>
                        <span className="text-gray-700 font-semibold">{formatOrderTime(order.orderTime)}</span>
                    </p>
                </div>
            </div>
            
            <div className="mt-4 pt-3 border-t-2 border-indigo-200 flex justify-between items-center">
                <span className="text-lg font-extrabold text-gray-900">
                    {formatCurrency(order.totalPrice)}
                </span>
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(order); }}
                    className="p-2 rounded-full bg-indigo-500 text-[#E8F4F1] hover:bg-indigo-600 transition shadow-md hover:shadow-lg shadow-indigo-300/50"
                    title="View Full Details"
                >
                    <Eye size={18} />
                </button>
            </div>
        </div>
    );
};


/**
 * Custom Modal implementation (Soft Indigo Theme)
 */
const OrderDetailsModal = ({ order, onClose }: { order: OrderType, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-900/60 bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#E8F4F1] rounded-xl shadow-2xl shadow-indigo-300 w-full max-w-md transform transition-all duration-300 scale-100 border-t-4 border-indigo-500">
                <header className="p-5 border-b border-[#FFF9EE] flex justify-between items-center bg-indigo-50/50 rounded-t-lg">
                    <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        Order History <span className="text-indigo-600 font-mono">#{order.id}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-indigo-100 text-gray-600 transition">
                        <XCircle className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-5 space-y-4">
                    <p className="text-gray-700 flex justify-between border-b border-[#FFF9EE] pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><User className="w-5 h-5"/> Customer:</span> 
                        <span className="font-bold text-gray-900">{order.customerName}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-[#FFF9EE] pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Utensils className="w-5 h-5"/> Restaurant:</span> 
                        <span className="font-bold text-gray-900">{order.restaurantName}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-[#FFF9EE] pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Clock className="w-5 h-5"/> Order Date:</span> 
                        <span className="font-semibold text-gray-600">{formatOrderTime(order.orderTime)}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between">
                        <span className="font-medium flex items-center gap-2 text-indigo-700">Total Items:</span> 
                        <span className="font-semibold text-gray-700">{order.itemsCount}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between text-2xl font-extrabold pt-4">
                        <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-indigo-700"/> Final Amount:</span> 
                        <span className="text-green-600 text-3xl">{formatCurrency(order.totalPrice)}</span>
                    </p>
                    <div className="flex justify-center pt-4">
                        <StatusBadge status={order.status} />
                    </div>
                </div>
                <footer className="p-4 border-t border-[#FFF9EE] bg-gray-50 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2 bg-[#FFF9EE] text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition shadow-md"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
};


// --- Main Component ---
export default function OrderHistoryPage() {
  const [orders] = useState<OrderType[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">(
    "All"
  );
  const [page, setPage] = useState(1);
  const perPage = 6;
  const [sortBy, setSortBy] = useState<SortKey>("orderTime");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

  /**
   * Toggles the sorting state for a given key.
   */
  const handleSort = useCallback(
    (key: SortKey) => {
      setPage(1);
      if (sortBy === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(key);
        const defaultDir = (key === "orderTime" || key === "totalPrice") ? "desc" : "asc";
        setSortDirection(defaultDir);
      }
    },
    [sortBy, sortDirection]
  );

  /**
   * Memoized computation for filtering and sorting the order data.
   */
  const filteredAndSortedOrders: OrderType[] = useMemo(() => {
    // 1. Filtering
    let filtered: OrderType[] = orders.filter((o) => {
      const matchesStatus = filterStatus === "All" || o.status === filterStatus;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        o.customerName.toLowerCase().includes(searchLower) ||
        o.restaurantName.toLowerCase().includes(searchLower) ||
        o.id.toString().includes(searchLower);

      return matchesStatus && matchesSearch;
    });

    // 2. Sorting
    filtered.sort((a, b) => {
      let comparison: number = 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (sortBy === 'orderTime') {
        comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
      }
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      
      return sortDirection === "asc" ? comparison : comparison * -1;
    });

    return filtered;
  }, [orders, filterStatus, search, sortBy, sortDirection]);

  const totalPages: number = Math.ceil(filteredAndSortedOrders.length / perPage);
  const paginatedOrders: OrderType[] = filteredAndSortedOrders.slice(
    (page - 1) * perPage,
    page * perPage
  );
  
  // Custom button component for sorting in the card view header (Indigo Theme)
  const SortButton: React.FC<{ label: string; sortKey: SortKey }> = ({ label, sortKey }) => (
<button
    onClick={() => handleSort(sortKey)}
    className={`flex items-center px-3 py-1 text-xs rounded-lg transition duration-200 border
        ${sortBy === sortKey
            ? 'bg-indigo-500 text-[#E8F4F1] border-indigo-500 shadow-sm'
            : 'bg-[#FFF9EE] text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-700'
        }
    `}
    aria-label={`Sort by ${label}`}
    aria-pressed={sortBy === sortKey}
>
    {label}
    <SortIndicator isSorted={sortBy === sortKey} direction={sortDirection} />
</button>

  );


  return (
    // Outer container: Soft Light Mode (Neutral background)
    <main className="min-h-screen bg-neutral-50 p-4 sm:p-6 md:p-10 flex justify-center font-sans">
      <div className="max-w-7xl w-full bg-[#E8F4F1] rounded-xl shadow-2xl border border-[#FFF9EE] p-6 lg:p-8">
        
        {/* Header */}
        <header className="mb-8 pb-4 border-b-4 border-indigo-400 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <History className="text-indigo-600 w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Historical Order Archives
          </h1>
          <p className="text-lg text-gray-500 ml-auto hidden md:block">Review Past Transactions</p>
        </header>

        {/* Filter + Search + Sort (Combined Section) */}
        <section
          aria-label="Filter and sort history"
          className="flex flex-col gap-6 mb-8"
        >
            {/* Search Input */}
            <div className="relative flex items-center w-full">
                <Search className="absolute left-3 text-indigo-600 w-5 h-5" />
                <input
                type="search"
                placeholder="Search ID, Customer, or Restaurant..."
                className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-[#E8F4F1] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition text-sm w-full shadow-inner"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                aria-label="Search orders by customer, restaurant, or ID"
                />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Status Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-gray-600 font-semibold text-sm">Filter By Status:</span>
                    {(["All", "Completed", "Cancelled"] as const).map((status) => (
                    <button
                        key={status}
                        onClick={() => {
                        setFilterStatus(status);
                        setPage(1);
                        }}
                        className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium transition duration-300 shadow-md
                        ${
                        filterStatus === status
                            ? "bg-indigo-500 text-[#E8F4F1] border-indigo-500 shadow-indigo-200/50"
                            : "bg-[#E8F4F1] text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400"
                        }`}
                        aria-pressed={filterStatus === status}
                    >
                        {status}
                    </button>
                    ))}
                </div>

                {/* Sort Controls for Card View */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-600 font-semibold text-sm">Sort By:</span>
                    <SortButton label="Time" sortKey="orderTime" />
                    <SortButton label="Price" sortKey="totalPrice" />
                    <SortButton label="Customer" sortKey="customerName" />
                </div>
            </div>
        </section>

        {/* Orders Grid/Cards */}
        <div className="min-h-[400px]">
            {paginatedOrders.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500 bg-[#FFF9EE] rounded-xl border border-gray-300">
                    <p>No historical orders found matching the current criteria.</p>
                </div>
            ) : (
                <div role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedOrders.map((order) => (
                        <OrderCard 
                            key={order.id} 
                            order={order} 
                            onViewDetails={setSelectedOrder} 
                        />
                    ))}
                </div>
            )}
        </div>

        {/* Pagination */}
        {filteredAndSortedOrders.length > perPage && (
          <nav
            className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-[#FFF9EE] rounded-xl shadow-inner border border-[#FFF9EE]"
            aria-label="Pagination Navigation"
          >
            <span className="text-gray-600 text-sm font-medium select-none mb-2 sm:mb-0">
              Showing {((page - 1) * perPage) + 1} -{" "}
              {Math.min(page * perPage, filteredAndSortedOrders.length)} of{" "}
              {filteredAndSortedOrders.length} orders
            </span>
            
            <div className="flex items-center gap-4">
              <p className="text-gray-700 text-sm select-none font-semibold">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-full bg-[#E8F4F1] border border-gray-300 shadow-md text-gray-700 hover:bg-[#FFF9EE] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                  aria-disabled={page === 1}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-full bg-[#E8F4F1] border border-gray-300 shadow-md text-gray-700 hover:bg-[#FFF9EE] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                  aria-disabled={page === totalPages}
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
            <OrderDetailsModal 
                order={selectedOrder} 
                onClose={() => setSelectedOrder(null)} 
            />
        )}

      </div>
    </main>
  );
}