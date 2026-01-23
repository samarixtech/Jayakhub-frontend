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
  CheckSquare,
  ChevronLeft, 
  ChevronRight, 
  ArrowUp,
  ArrowDown,
  IndianRupee, 
} from "lucide-react";

type OrderStatus = "Active" | "Completed" | "Cancelled";
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

const sampleOrders: OrderType[] = [
  { id: 101, customerName: "Amit Kumar", restaurantName: "Italiano Kitchen", itemsCount: 3, totalPrice: 650, status: "Active", orderTime: "2025-11-27T10:15:00" },
  { id: 102, customerName: "Neha Singh", restaurantName: "Burger Hub", itemsCount: 2, totalPrice: 400, status: "Active", orderTime: "2025-11-27T10:20:00" },
  { id: 103, customerName: "Rahul Sharma", restaurantName: "Royal Biryani House", itemsCount: 4, totalPrice: 1200, status: "Completed", orderTime: "2025-11-26T19:45:00" },
  { id: 104, customerName: "Simran Kaur", restaurantName: "Sushi Express", itemsCount: 1, totalPrice: 300, status: "Active", orderTime: "2025-11-27T11:05:00" },
  { id: 105, customerName: "Anil Verma", restaurantName: "Spicy Tandoor", itemsCount: 5, totalPrice: 1100, status: "Cancelled", orderTime: "2025-11-25T18:30:00" },
  { id: 106, customerName: "Kriti Malik", restaurantName: "Green Vegan Deli", itemsCount: 2, totalPrice: 800, status: "Active", orderTime: "2025-11-27T09:30:00" },
  { id: 107, customerName: "Vikram Jha", restaurantName: "Italiano Kitchen", itemsCount: 6, totalPrice: 1850, status: "Completed", orderTime: "2025-11-26T12:00:00" },
  { id: 108, customerName: "Pooja Desai", restaurantName: "Street Wok", itemsCount: 3, totalPrice: 550, status: "Active", orderTime: "2025-11-27T10:00:00" },
  { id: 109, customerName: "Rajesh Soni", restaurantName: "Burger Hub", itemsCount: 1, totalPrice: 250, status: "Cancelled", orderTime: "2025-11-26T15:10:00" },
  { id: 110, customerName: "Disha Parekh", restaurantName: "Royal Biryani House", itemsCount: 7, totalPrice: 2200, status: "Active", orderTime: "2025-11-27T08:45:00" },
  { id: 111, customerName: "Gaurav Roy", restaurantName: "Spicy Tandoor", itemsCount: 4, totalPrice: 950, status: "Active", orderTime: "2025-11-27T09:55:00" },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  let bgColor: string, textColor: string, icon: React.ReactNode;

  switch (status) {
    case "Active":
      bgColor = "bg-sky-100";
      textColor = "text-sky-800";
      icon = <Clock className="text-sky-600 w-4 h-4" />;
      break;
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
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold [#E8F4F1]space-nowrap border border-opacity-50 ${bgColor} ${textColor}`}
      aria-label={`${status} status`}
    >
      {icon}
      {status}
    </span>
  );
}

const SortIndicator: React.FC<{ isSorted: boolean; direction: "asc" | "desc" }> = ({
  isSorted,
  direction,
}) => {
  if (!isSorted) {
    return null;
  }
  return direction === "asc" ? (
    <ArrowUp className="inline ml-1 w-4 h-4 text-indigo-500" />
  ) : (
    <ArrowDown className="inline ml-1 w-4 h-4 text-indigo-500" />
  );
}


const formatOrderTime = (isoString: string): string => {
    const orderDate = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - orderDate.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60 && diffMins >= 0) {
        return `${diffMins} mins ago`;
    }
    
    // Fallback to standard formatting
    return orderDate.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
};


const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}


export default function ActiveOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>(sampleOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "All">(
    "Active"
  );
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [sortBy, setSortBy] = useState<SortKey>("orderTime");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);

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

  const filteredAndSortedOrders: OrderType[] = useMemo(() => {

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

      // Handle numerical and date sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (sortBy === 'orderTime') {
        comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
      }
      // Handle string sorting
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
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

  // Mark order complete action (from user's template)
  const markCompleted = (id: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Completed" } : o))
    );
    setSelectedOrder(null); // Close details if open
    console.log(`Order #${id} marked as Completed.`);
  };

  // Function to render sortable table header cells
const getAriaSortValue = (direction: "asc" | "desc" | null) => {
  if (direction === "asc") return "ascending";
  if (direction === "desc") return "descending";
  return "none";
};

const renderSortableHeader = (
  label: string,
  key: SortKey,
  align: "left" | "center" | "right" = "left"
) => (
  <th
    className={`py-3 px-4 text-${align} cursor-pointer hover:bg-indigo-50 transition select-none text-xs sm:text-sm`}
    onClick={() => handleSort(key)}
    aria-sort={sortBy === key ? getAriaSortValue(sortDirection) : "none"}
  >
    <div
      className={`flex items-center gap-1 font-bold ${
        align === "right"
          ? "justify-end"
          : align === "center"
          ? "justify-center"
          : ""
      }`}
    >
      {label}
      <SortIndicator isSorted={sortBy === key} direction={sortDirection} />
    </div>
  </th>
);

  const OrderDetailsModal = ({ order, onClose }: { order: OrderType, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-900/60 bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#E8F4F1] rounded-3xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 border-t-8 border-indigo-400">
                <header className="p-6 border-b flex justify-between items-center bg-indigo-50/50 rounded-t-2xl">
                    <h2 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                        Order Details <span className="text-indigo-600 font-mono">#{order.id}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[#E8F4F1] text-gray-600 transition">
                        <XCircle className="w-6 h-6" />
                    </button>
                </header>
                <div className="p-6 space-y-5">
                    <p className="text-gray-700 flex justify-between border-b pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><User className="w-5 h-5"/> Customer:</span> 
                        <span className="font-bold text-gray-900">{order.customerName}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Utensils className="w-5 h-5"/> Restaurant:</span> 
                        <span className="font-bold text-gray-900">{order.restaurantName}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b pt-2 pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Clock className="w-5 h-5"/> Order Time:</span> 
                        <span className="font-semibold text-gray-700">{formatOrderTime(order.orderTime)}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between">
                        <span className="font-medium flex items-center gap-2 text-indigo-700">Total Items:</span> 
                        <span className="font-semibold text-gray-700">{order.itemsCount}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between text-3xl font-extrabold pt-4">
                        <span className="text-lg font-medium text-gray-700 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-indigo-700"/> Total Amount:</span> 
                        <span className="text-green-600">{formatCurrency(order.totalPrice)}</span>
                    </p>
                    <div className="flex justify-center pt-4">
                        <StatusBadge status={order.status} />
                    </div>
                </div>
                <footer className="p-5 border-t bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                    {order.status === "Active" && (
                        <button
                            onClick={() => markCompleted(order.id)}
                            className="flex items-center gap-2 px-5 py-2 bg-green-500 text-[#E8F4F1] font-semibold rounded-xl hover:bg-green-600 transition shadow-lg shadow-green-200"
                        >
                            <CheckSquare className="w-5 h-5"/> Mark Completed
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-400 transition shadow-md"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
  };


  return (
    <main className="min-h-screen bg-neutral-50 p-4 sm:p-6 md:p-10 flex justify-center font-sans">
      <div className="max-w-7xl w-full bg-[#E8F4F1] rounded-3xl shadow-xl border border-[#FFF9EE] p-6 lg:p-8">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 pb-4 border-b-4 border-indigo-400">
          <Utensils className="text-indigo-600 w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Management 
          </h1>
          <p className="text-lg text-gray-500 ml-auto hidden md:block">Live Tracking & Actions</p>
        </header>

        {/* Filter + Search */}
        <section
          aria-label="Filter and search active orders"
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-10"
        >
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Active", "Completed", "Cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setPage(1);
                }}
                className={`flex items-center gap-1 px-5 py-2 rounded-2xl border-2 text-sm font-medium transition duration-300 shadow-sm
                ${
                  filterStatus === status
                    ? "bg-indigo-500 text-[#E8F4F1] border-indigo-500 shadow-lg shadow-indigo-200 transform scale-[1.02]"
                    : "bg-[#E8F4F1] text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-400"
                }`}
                aria-pressed={filterStatus === status}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex items-center w-full lg:w-96">
            <Search className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search ID, Customer, or Restaurant..."
              className="pl-10 pr-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition text-sm w-full shadow-inner"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search orders by customer, restaurant, or ID"
            />
          </div>
        </section>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-300">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-indigo-50 text-indigo-800 text-sm uppercase font-bold tracking-wider">
                {renderSortableHeader("Order ID", "id")}
                {renderSortableHeader("Customer", "customerName")}
                {renderSortableHeader("Items", "itemsCount", "center")}
                {renderSortableHeader("Restaurant", "restaurantName")}
                {renderSortableHeader("Total Price", "totalPrice", "right")}
                {renderSortableHeader("Order Time", "orderTime", "center")}
                <th className="py-3 px-4 text-center text-sm font-bold">Status</th>
                <th className="py-3 px-4 text-center text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-lg text-gray-500 bg-[#E8F4F1]">
                    <p>No orders found matching the current criteria.</p>
                  </td>
                </tr>
              )}

              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  tabIndex={0}
                  className={`border-t border-[#FFF9EE] bg-[#E8F4F1] hover:bg-indigo-50/70 cursor-pointer transition duration-150 ease-in-out group ${
                    order.status === 'Active' ? 'bg-sky-50/50' : ''
                  }`}
                  aria-label={`Order ${order.id}`}
                >
                  <td className="py-3 px-4 font-mono text-gray-900 font-semibold">
                    #{order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-800 flex items-center gap-2">
                    <User className="text-gray-500 w-4 h-4 shrink-0" /> {order.customerName}
                  </td>
                
                  <td className="py-3 px-4 text-center font-semibold text-gray-800">
                    {order.itemsCount}
                  </td>
                    <td className="py-3 px-4 text-gray-700 flex items-center gap-2">
                    <Utensils className="text-gray-500 w-4 h-4 shrink-0" /> {order.restaurantName}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-green-700">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="py-3 px-4 text-center text-gray-600 text-sm">
                    {formatOrderTime(order.orderTime)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 px-4 text-center flex justify-center gap-2">
                    {/* View details button */}
                    <button
                      title="View Details"
                      className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition shadow-sm"
                      onClick={() => {
                          setSelectedOrder(order);
                          console.log(`Simulating view details for Order #${order.id}`);
                      }}
                    >
                      <Eye size={20} />
                    </button>

                    {/* Mark Completed button (only if active) */}
                    {order.status === "Active" && (
                      <button
                        title="Mark as Completed"
                        className="text-green-600 hover:bg-green-100 p-2 rounded-full transition shadow-sm"
                        onClick={() => markCompleted(order.id)}
                      >
                        <CheckSquare size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAndSortedOrders.length > perPage && (
          <nav
            className="flex flex-col sm:flex-row justify-between items-center mt-8 p-3 bg-[#FFF9EE] rounded-2xl shadow-inner border border-[#FFF9EE]"
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
                  className="p-2 rounded-full bg-[#E8F4F1] border border-gray-300 shadow-md hover:bg-[#FFF9EE] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                  aria-disabled={page === 1}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-full bg-[#E8F4F1] border border-gray-300 shadow-md hover:bg-[#FFF9EE] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                  aria-disabled={page === totalPages}
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>
          </nav>
        )}

        {/* Order Details Modal (to replace alert) */}
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