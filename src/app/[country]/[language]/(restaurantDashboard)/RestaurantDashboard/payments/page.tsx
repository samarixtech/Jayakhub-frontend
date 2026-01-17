"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search,
  Clock,
  IndianRupee,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  History,
  Receipt, 
  Wallet,
} from "lucide-react";

type PaymentStatus = "Success" | "Failed" | "Pending";
type SortKey = "id" | "invoiceId" | "method" | "amount" | "transactionTime";

interface PaymentType {
  id: number;
  invoiceId: string;
  method: string; 
  amount: number;
  status: PaymentStatus;
  transactionTime: string;
}

// --- Sample Data ---
const samplePayments: PaymentType[] = [
  { id: 501, invoiceId: "INV-2025-01", method: "UPI", amount: 1200, status: "Success", transactionTime: "2025-11-26T19:46:00" },
  { id: 502, invoiceId: "INV-2025-02", method: "Card", amount: 1100, status: "Failed", transactionTime: "2025-11-25T18:35:00" },
  { id: 503, invoiceId: "INV-2025-03", method: "Net Banking", amount: 1850, status: "Success", transactionTime: "2025-11-26T12:05:00" },
  { id: 504, invoiceId: "INV-2025-04", method: "UPI", amount: 250, status: "Success", transactionTime: "2025-11-26T15:15:00" },
  { id: 505, invoiceId: "INV-2025-05", method: "Card", amount: 900, status: "Pending", transactionTime: "2025-11-24T17:25:00" },
  { id: 506, invoiceId: "INV-2025-06", method: "UPI", amount: 750, status: "Success", transactionTime: "2025-11-23T20:05:00" },
  { id: 507, invoiceId: "INV-2025-07", method: "Card", amount: 350, status: "Success", transactionTime: "2025-11-22T11:45:00" },
  { id: 508, invoiceId: "INV-2025-08", method: "Net Banking", amount: 1500, status: "Success", transactionTime: "2025-11-21T16:20:00" },
  { id: 509, invoiceId: "INV-2025-09", method: "UPI", amount: 500, status: "Failed", transactionTime: "2025-11-20T14:10:00" },
  { id: 510, invoiceId: "INV-2025-10", method: "Card", amount: 2500, status: "Pending", transactionTime: "2025-11-19T21:35:00" },
];

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  let bgColor: string, textColor: string, icon: React.ReactNode;

  switch (status) {
    case "Success":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      icon = <CheckCircle className="text-green-600 w-4 h-4" />;
      break;
    case "Failed":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      icon = <XCircle className="text-red-600 w-4 h-4" />;
      break;
    case "Pending":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-800";
        icon = <AlertTriangle className="text-yellow-600 w-4 h-4" />;
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


const formatTransactionTime = (isoString: string): string => {
    const transactionDate = new Date(isoString);
    return transactionDate.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}


const PaymentRow = ({ payment, onViewDetails }: { payment: PaymentType, onViewDetails: (payment: PaymentType) => void }) => {
    return (
        <>
            {/* Desktop Row (Table) */}
            <tr
                className="hidden md:table-row bg-[#E8F4F1] border-b border-[#FFF9EE] hover:bg-indigo-50 transition duration-150 cursor-pointer"
                onClick={() => onViewDetails(payment)}
                tabIndex={0}
                role="row"
            >
                <td className="p-4 text-sm font-medium text-gray-900">#{payment.id}</td>
                <td className="p-4 text-sm text-indigo-600 font-mono">{payment.invoiceId}</td>
                <td className="p-4 text-sm text-gray-700 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-gray-400"/> {payment.method}
                </td>
                <td className="p-4 text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</td>
                <td className="p-4 text-sm text-gray-500">{formatTransactionTime(payment.transactionTime)}</td>
                <td className="p-4 text-sm">
                    <PaymentStatusBadge status={payment.status} />
                </td>
                <td className="p-4 text-center">
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(payment); }}
                        className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                </td>
            </tr>

            {/* Mobile List Item (Condensed Card/List) */}
            {/* This acts as a fallback for small screens (md:hidden) */}
            <div 
                className="md:hidden bg-[#E8F4F1] p-4 rounded-xl border border-[#FFF9EE] shadow-sm hover:shadow-md hover:shadow-indigo-50 transition duration-300 mb-3 cursor-pointer"
                onClick={() => onViewDetails(payment)}
                tabIndex={0}
                role="listitem"
            >
                <div className="flex justify-between items-center border-b border-[#FFF9EE] pb-2 mb-2">
                    <span className="font-bold text-indigo-600">
                        {payment.invoiceId}
                    </span>
                    <PaymentStatusBadge status={payment.status} />
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400"/> TID: <span className="text-gray-900 font-semibold">#{payment.id}</span></p>
                    <p className="flex items-center gap-2 justify-end"><Wallet className="w-4 h-4 text-gray-400"/> {payment.method}</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400"/> {formatTransactionTime(payment.transactionTime)}</p>
                    <p className="text-lg font-extrabold text-green-600 text-right">{formatCurrency(payment.amount)}</p>
                </div>
                
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(payment); }}
                    className="mt-3 w-full py-2 bg-indigo-500 text-[#E8F4F1] font-semibold rounded-lg hover:bg-indigo-600 transition shadow-md flex items-center justify-center gap-2"
                    title="View Full Details"
                >
                    View Details <Eye size={18} />
                </button>
            </div>
        </>
    );
};


/**
 * Custom Modal implementation (Soft Indigo Theme)
 */
const PaymentDetailsModal = ({ payment, onClose }: { payment: PaymentType, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-900/60 bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#E8F4F1] rounded-xl shadow-2xl shadow-indigo-300 w-full max-w-md transform transition-all duration-300 scale-100 border-t-4 border-indigo-500">
                <header className="p-5 border-b border-[#FFF9EE] flex justify-between items-center bg-indigo-50/50 rounded-t-lg">
                    <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        Payment Transaction <span className="text-indigo-600 font-mono">#{payment.id}</span>
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-indigo-100 text-gray-600 transition">
                        <XCircle className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-5 space-y-4">
                    <p className="text-gray-700 flex justify-between border-b border-[#FFF9EE] pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Receipt className="w-5 h-5"/> Invoice ID:</span> 
                        <span className="font-bold text-gray-900">{payment.invoiceId}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-[#FFF9EE] pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Wallet className="w-5 h-5"/> Method:</span> 
                        <span className="font-bold text-gray-900">{payment.method}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between border-b border-[#FFF9EE] pb-2">
                        <span className="font-medium flex items-center gap-2 text-indigo-700"><Clock className="w-5 h-5"/> Transaction Time:</span> 
                        <span className="font-semibold text-gray-600">{formatTransactionTime(payment.transactionTime)}</span>
                    </p>
                    <p className="text-gray-700 flex justify-between text-2xl font-extrabold pt-4">
                        <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><IndianRupee className="w-5 h-5 text-indigo-700"/> Total Paid:</span> 
                        <span className="text-green-600 text-3xl">{formatCurrency(payment.amount)}</span>
                    </p>
                    <div className="flex justify-center pt-4">
                        <PaymentStatusBadge status={payment.status} />
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
export default function PaymentHistoryPage() {
  const [payments] = useState<PaymentType[]>(samplePayments);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | "All">(
    "All"
  );
  const [page, setPage] = useState(1);
  const perPage = 10; // Increased perPage for table view
  const [sortBy, setSortBy] = useState<SortKey>("transactionTime");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc");
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

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
        // Default to descending for time and amount, ascending for text
        const defaultDir = (key === "transactionTime" || key === "amount") ? "desc" : "asc";
        setSortDirection(defaultDir);
      }
    },
    [sortBy, sortDirection]
  );

  /**
   * Memoized computation for filtering and sorting the payment data.
   */
  const filteredAndSortedPayments: PaymentType[] = useMemo(() => {
    // 1. Filtering
    let filtered: PaymentType[] = payments.filter((p) => {
      const matchesStatus = filterStatus === "All" || p.status === filterStatus;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        p.invoiceId.toLowerCase().includes(searchLower) ||
        p.method.toLowerCase().includes(searchLower) ||
        p.id.toString().includes(searchLower);

      return matchesStatus && matchesSearch;
    });

    // 2. Sorting
    filtered.sort((a, b) => {
      let comparison: number = 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (sortBy === 'transactionTime') {
        comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
      }
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      
      return sortDirection === "asc" ? comparison : comparison * -1;
    });

    return filtered;
  }, [payments, filterStatus, search, sortBy, sortDirection]);

  const totalPages: number = Math.ceil(filteredAndSortedPayments.length / perPage);
  const paginatedPayments: PaymentType[] = filteredAndSortedPayments.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const TableSortHeader: React.FC<{ label: string; sortKey: SortKey }> = ({ label, sortKey }) => (
<button
    onClick={() => handleSort(sortKey)}
    className="flex items-center text-left text-xs font-semibold uppercase tracking-wider text-indigo-500 hover:text-indigo-700 transition"
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
          <CreditCard className="text-indigo-600 w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Transaction History
          </h1>
          <p className="text-lg text-gray-500 ml-auto hidden md:block">Review All Payment Records</p>
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
                placeholder="Search ID, Invoice, or Payment Method..."
                className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 bg-[#E8F4F1] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition text-sm w-full shadow-inner"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                aria-label="Search payments by ID, invoice, or method"
                />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-600 font-semibold text-sm">Filter By Status:</span>
                {(["All", "Success", "Failed", "Pending"] as const).map((status) => (
                <button
                    key={status}
                    onClick={() => {
                    setFilterStatus(status);
                    setPage(1);
                    }}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg border text-sm font-medium transition duration-300 shadow-sm
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
        </section>

        {/* Payments Table/List */}
        <div className="min-h-[400px] shadow-lg rounded-xl overflow-x-auto">
            {paginatedPayments.length === 0 ? (
                <div className="text-center py-20 text-xl text-gray-500 bg-[#FFF9EE] rounded-xl border border-gray-300">
                    <p>No payment records found matching the current criteria.</p>
                </div>
            ) : (
                <>
                {/* Desktop Table View */}
                <table className="min-w-full divide-y divide-[#FFF9EE] hidden md:table">
                    <thead className="bg-indigo-50">
                        <tr>
                            <th className="p-4 text-left">
                                <TableSortHeader label="TID" sortKey="id" />
                            </th>
                            <th className="p-4 text-left">
                                <TableSortHeader label="Invoice ID" sortKey="invoiceId" />
                            </th>
                            <th className="p-4 text-left">
                                <TableSortHeader label="Method" sortKey="method" />
                            </th>
                            <th className="p-4 text-left">
                                <TableSortHeader label="Amount" sortKey="amount" />
                            </th>
                            <th className="p-4 text-left">
                                <TableSortHeader label="Time" sortKey="transactionTime" />
                            </th>
                            <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-indigo-500">
                                Status
                            </th>
                            <th className="p-4 text-center text-xs font-semibold uppercase tracking-wider text-indigo-500">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#E8F4F1] divide-y divide-[#FFF9EE]">
                        {paginatedPayments.map((payment) => (
                            <PaymentRow 
                                key={payment.id} 
                                payment={payment} 
                                onViewDetails={setSelectedPayment} 
                            />
                        ))}
                    </tbody>
                </table>
                {/* Mobile List View (Rendered by PaymentRow component, hidden on MD+) */}
                <div className="md:hidden p-4">
                    {paginatedPayments.map((payment) => (
                        <PaymentRow 
                            key={payment.id} 
                            payment={payment} 
                            onViewDetails={setSelectedPayment} 
                        />
                    ))}
                </div>
                </>
            )}
        </div>

        {/* Pagination */}
        {filteredAndSortedPayments.length > 0 && (
          <nav
            className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-[#FFF9EE] rounded-xl shadow-inner border border-[#FFF9EE]"
            aria-label="Pagination Navigation"
          >
            <span className="text-gray-600 text-sm font-medium select-none mb-2 sm:mb-0">
              Showing {((page - 1) * perPage) + 1} -{" "}
              {Math.min(page * perPage, filteredAndSortedPayments.length)} of{" "}
              {filteredAndSortedPayments.length} transactions
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

        {/* Payment Details Modal */}
        {selectedPayment && (
            <PaymentDetailsModal 
                payment={selectedPayment} 
                onClose={() => setSelectedPayment(null)} 
            />
        )}

      </div>
    </main>
  );
}