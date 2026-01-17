"use client";

import { useState, useMemo, useCallback } from "react";
// Removed dependency on 'react-icons/md' and replaced with inline SVGs and Unicode/Emojis for guaranteed compilation.

// --- Inline SVG Icons for functionality and professional look ---

// Status Icons
const CheckCircleIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-4 h-4"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const RemoveCircleIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-4 h-4"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

// Search Icon
const SearchIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-5 h-5"}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

// Sort Icons
const ArrowUpIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-4 h-4"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowDownIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-4 h-4"}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Chevron Icons
const ChevronLeftIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-6 h-6"}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = (props: { className?: string }) => (
  <svg
    {...props}
    className={props.className || "w-6 h-6"}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

// Define sortable keys explicitly
type SortKey = "name" | "orders" | "revenue" | "rating" | "category" | "location";

interface RestaurantType {
  id: number;
  name: string;
  category: string;
  location: string;
  status: "Active" | "Inactive";
  orders: number;
  revenue: string;
  rating: number;
}

const sampleRestaurants: RestaurantType[] = [
  {
    id: 1,
    name: "Italiano Kitchen",
    category: "Italian",
    location: "Delhi",
    status: "Active",
    orders: 431,
    revenue: "₹78,300",
    rating: 4.7,
  },
  {
    id: 2,
    name: "Burger Hub",
    category: "Fast Food",
    location: "Gurgaon",
    status: "Inactive",
    orders: 81,
    revenue: "₹15,900",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Royal Biryani House",
    category: "Indian",
    location: "Noida",
    status: "Active",
    orders: 538,
    revenue: "₹1,12,200",
    rating: 4.9,
  },
  {
    id: 4,
    name: "Sushi Express",
    category: "Japanese",
    location: "Delhi",
    status: "Active",
    orders: 320,
    revenue: "₹92,100",
    rating: 4.5,
  },
  {
    id: 5,
    name: "Green Vegan",
    category: "Vegan",
    location: "Gurgaon",
    status: "Inactive",
    orders: 90,
    revenue: "₹20,500",
    rating: 4.0,
  },
  {
    id: 6,
    name: "Spicy Tandoor",
    category: "Indian",
    location: "Noida",
    status: "Active",
    orders: 410,
    revenue: "₹75,600",
    rating: 4.6,
  },
  {
    id: 7,
    name: "Pancake Paradise",
    category: "Dessert",
    location: "Mumbai",
    status: "Active",
    orders: 150,
    revenue: "₹35,000",
    rating: 4.1,
  },
  {
    id: 8,
    name: "Seafood Spot",
    category: "Seafood",
    location: "Chennai",
    status: "Active",
    orders: 290,
    revenue: "₹1,30,000",
    rating: 4.8,
  },
];

/**
 * StatusBadge Component
 * Displays an icon and text for the restaurant's status.
 */
function StatusBadge({ status }: { status: "Active" | "Inactive" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold [#E8F4F1]space-nowrap
        ${
          status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      aria-label={`${status} status`}
    >
      {status === "Active" ? (
        <CheckCircleIcon className="text-green-600 w-5 h-5" />
      ) : (
        <RemoveCircleIcon className="text-red-600 w-5 h-5" />
      )}
      {status}
    </span>
  );
}

/**
 * SortIndicator Component
 * Shows the up/down arrow for the current sort column.
 */
function SortIndicator({
  isSorted,
  direction,
}: {
  isSorted: boolean;
  direction: "asc" | "desc";
}) {
  if (!isSorted) {
    return null;
  }
  return direction === "asc" ? (
    <ArrowUpIcon className="inline ml-1 w-4 h-4" />
  ) : (
    <ArrowDownIcon className="inline ml-1 w-4 h-4" />
  );
}

/**
 * Main Restaurants List Page Component
 */
export default function App() {
  const [restaurants] = useState<RestaurantType[]>(sampleRestaurants);
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortKey>("orders");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const perPage = 5;

  /**
   * Toggles the sorting state for a given key.
   * If the same key is clicked, it reverses the direction. Otherwise, it sets the new key to 'desc'.
   */
  const handleSort = useCallback(
    (key: SortKey) => {
      setPage(1); // Reset to page 1 on sort change
      if (sortBy === key) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(key);
        setSortDirection("desc"); // Default sort is descending for new columns (e.g., highest rating first)
      }
    },
    [sortBy, sortDirection]
  );

  /**
   * Memoized computation for filtering and sorting the restaurant data.
   */
  const filteredAndSortedRestaurants = useMemo(() => {
    // 1. Filtering
    let filtered = restaurants.filter((r) => {
      const statusMatch = filterStatus === "All" || r.status === filterStatus;
      const searchMatch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.category.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase());
      return statusMatch && searchMatch;
    });

    // 2. Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Handle numerical sorting (orders and rating)
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } 
      // Handle string sorting (name, category, location)
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        // Use a utility function to safely extract and compare numerical values from revenue strings
        if (sortBy === 'revenue') {
          const parseRevenue = (rev: string) => parseFloat(rev.replace(/[₹,]/g, ''));
          comparison = parseRevenue(aValue) - parseRevenue(bValue);
        } else {
          comparison = aValue.localeCompare(bValue);
        }
      }

      return sortDirection === "asc" ? comparison : comparison * -1;
    });

    return filtered;
  }, [restaurants, filterStatus, search, sortBy, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedRestaurants.length / perPage);
  const paginatedRestaurants = filteredAndSortedRestaurants.slice(
    (page - 1) * perPage,
    page * perPage
  );

const mapSortDirection = (dir: "asc" | "desc" | null) => {
  if (dir === "asc") return "ascending";
  if (dir === "desc") return "descending";
  return "none";
};

const renderSortableHeader = (
  label: string,
  key: SortKey,
  align: "left" | "center" | "right" = "left"
) => (
  <th
    className={`py-3 px-4 text-${align} cursor-pointer hover:bg-[#FFF9EE] transition select-none`}
    onClick={() => handleSort(key)}
    aria-sort={sortBy === key ? mapSortDirection(sortDirection) : "none"}
  >
    <div
      className={`flex items-center gap-1 ${
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


  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10 flex justify-center font-sans">
      <div className="max-w-6xl w-full bg-[#E8F4F1] rounded-xl shadow-2xl border border-[#FFF9EE] p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="flex items-center gap-4 mb-6 pb-4 border-b border-[#FFF9EE]">
          {/* Restaurant Icon */}
          <span className="text-[#0B5D4E] text-4xl">🍽️</span> 
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Restaurant Performance Dashboard
          </h1>
        </header>

        {/* Filters + Search */}
        <section
          aria-label="Filter and Search restaurants"
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8"
        >
          {/* Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Active", "Inactive"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status as "All" | "Active" | "Inactive");
                  setPage(1);
                }}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg border-2 text-sm font-medium transition duration-300
                ${
                  filterStatus === status
                    ? "bg-[#0B5D4E] text-[#E8F4F1] border-[#0B5D4E] shadow-md shadow-yellow-200"
                    : "bg-[#E8F4F1] text-gray-700 border-gray-300 hover:bg-[#0B5D4E] hover:border-yellow-400"
                }`}
                aria-pressed={filterStatus === status}
              >
                {status === "All" && <span className="text-lg">🍔</span>} 
                {status === "Active" && <CheckCircleIcon className="w-5 h-5" />}
                {status === "Inactive" && <RemoveCircleIcon className="w-5 h-5" />}
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex items-center w-full lg:w-72">
            <SearchIcon className="absolute left-3 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search by name or category..."
              className="pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] transition text-sm w-full shadow-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              aria-label="Search restaurants"
            />
          </div>
        </section>

        {/* Restaurants List Table */}
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-300">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-[#FFF9EE] text-gray-600 text-xs sm:text-sm uppercase font-bold tracking-wider">
                {renderSortableHeader("Name", "name")}
                {renderSortableHeader("Category", "category")}
                {renderSortableHeader("Location", "location")}
                {renderSortableHeader("Orders", "orders", "center")}
                {renderSortableHeader("Revenue", "revenue", "right")}
                {renderSortableHeader("Rating", "rating", "center")}
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRestaurants.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-lg text-gray-500 bg-[#E8F4F1]"
                  >
                    <p>No results match your criteria.</p>
                    <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                  </td>
                </tr>
              )}

              {paginatedRestaurants.map((r) => (
                <tr
                  key={r.id}
                  tabIndex={0}
                  className="border-t border-[#FFF9EE] bg-[#E8F4F1] hover:bg-[#0B5D4E] cursor-pointer transition duration-150 ease-in-out group"
                  aria-label={`${r.name} details`}
                >
                  {/* Name */}
                  <td className="py-4 px-4 font-semibold text-gray-900 flex items-center gap-3">
                    <span className="text-[#0B5D4E] text-xl group-hover:text-[#B6932F] transition">🍽️</span> 
                    {r.name}
                  </td>
                  {/* Category */}
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">📦</span>
                      {r.category}
                    </div>
                  </td>
                  {/* Location */}
                  <td className="py-4 px-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">📍</span>
                      {r.location}
                    </div>
                  </td>
                  {/* Orders */}
                  <td className="py-4 px-4 text-center text-gray-800 font-bold">
                    <span className="inline-block mr-1 text-gray-600">🧾</span>
                    {r.orders}
                  </td>
                  {/* Revenue */}
                  <td className="py-4 px-4 text-right text-green-700 font-bold">
                    <span className="inline-block mr-1">₹</span>
                    {r.revenue.replace("₹", "")}
                  </td>
                  {/* Rating */}
                  <td className="py-4 px-4 text-center text-yellow-600 font-bold">
                    <div className="flex items-center justify-center gap-1">
                      {r.rating.toFixed(1)} <span className="text-lg">⭐</span>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="py-4 px-4 text-center">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAndSortedRestaurants.length > 0 && (
          <nav
            className="flex justify-between items-center mt-8 p-3 bg-[#FFF9EE] rounded-lg shadow-inner"
            aria-label="Pagination Navigation"
          >
            <span className="text-gray-600 text-sm font-medium select-none">
              Showing {((page - 1) * perPage) + 1} -{" "}
              {Math.min(page * perPage, filteredAndSortedRestaurants.length)} of{" "}
              {filteredAndSortedRestaurants.length} results
            </span>

            <div className="flex items-center gap-4">
              <p className="text-gray-600 text-sm select-none">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-full bg-[#E8F4F1] border border-gray-300 hover:bg-[#FFF9EE] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                  aria-disabled={page === 1}
                  aria-label="Previous Page"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-full bg-[#E8F4F1] border border-gray-300 hover:bg-[#FFF9EE] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
                  aria-disabled={page === totalPages}
                  aria-label="Next Page"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}