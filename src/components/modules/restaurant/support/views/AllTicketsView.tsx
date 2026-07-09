"use client";

import { useState, useEffect } from "react";
import { useSupportTickets } from "../hooks/useSupportTickets";
import { useTicketStats } from "../hooks/useTicketStats";
import { AllTicketsTable } from "../components/AllTicketsTable";
import { TicketStatsCards } from "../components/TicketStatsCards";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import GlobalSelect from "@/components/common/GlobalSelect";
import { GlobalPagination } from "@/components/common/GlobalPagination";
import type { Ticket } from "../support.types";

const AllTicketsView = () => {
  const t = useTranslations("RestaurantDashboard.Support");
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsLimit = 10;

  // Debounce search term to avoid excessive API requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { stats, isLoading: statsLoading } = useTicketStats();

  const { tickets, isLoading, meta, setParams } = useSupportTickets({
    limit: itemsLimit,
    page: currentPage,
    status: statusFilter === "all" ? undefined : statusFilter,
    priority: priorityFilter === "all" ? undefined : priorityFilter,
    search: debouncedSearch || undefined,
  });

  // Sync params state of the hook with local filters/pagination state
  useEffect(() => {
    setParams({
      limit: itemsLimit,
      page: currentPage,
      status: statusFilter === "all" ? undefined : statusFilter,
      priority: priorityFilter === "all" ? undefined : priorityFilter,
      search: debouncedSearch || undefined,
    });
  }, [debouncedSearch, statusFilter, priorityFilter, currentPage, setParams]);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTicketClick = (ticket: Ticket) => {
    router.push(`/restaurant/support/${ticket.id}`);
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "RESOLVED", label: "Resolved" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "LOW", label: "Low" },
    { value: "MEDIUM", label: "Medium" },
    { value: "HIGH", label: "High" },
  ];

  const totalPages = meta?.totalPages || 1;

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 animate-fadeSlide">
      {/* Page Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/restaurant/support")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-[13px] font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("ticketChat.back")}
        </button>
      </div>

      {/* Stats Cards */}
      <TicketStatsCards stats={stats} isLoading={statsLoading} />

      {/* Search & Filters Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search tickets..."
            className="pl-9 h-10 bg-white border-gray-200 focus:ring-[#1F4D36] focus:border-[#1F4D36]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div className="w-full sm:w-[180px]">
            <GlobalSelect
              value={statusFilter}
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder="Status"
            />
          </div>
          <div className="w-full sm:w-[180px]">
            <GlobalSelect
              value={priorityFilter}
              onChange={handlePriorityChange}
              options={priorityOptions}
              placeholder="Priority"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div>
        <AllTicketsTable
          tickets={tickets}
          isLoading={isLoading}
          onTicketClick={handleTicketClick}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <GlobalPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default AllTicketsView;
