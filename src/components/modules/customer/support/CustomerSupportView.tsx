"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SupportTicket, TicketStats, SUPPORT_CATEGORIES, SUPPORT_PRIORITIES } from "./types";
import { fetchTicketStats, fetchTickets } from "./support-service";
import { SupportHeader } from "./components/SupportHeader";
import { SupportStats } from "./components/SupportStats";
import { TicketCard } from "./components/TicketCard";
import { CreateTicketModal } from "./components/CreateTicketModal";
import { DeleteTicketModal } from "./components/DeleteTicketModal";
import { TicketDetailChat } from "./components/TicketDetailChat";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import { Search, Filter, Headphones, LifeBuoy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerSupportView() {
  const t = useTranslations("CustomerDashboard.Support");
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    pending: 0,
    resolved: 0,
    closed: 0,
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Active view: list vs chat detail
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const [statsRes, ticketsRes] = await Promise.all([
      fetchTicketStats(),
      fetchTickets(1, 50),
    ]);

    setStats(statsRes);
    setTickets(ticketsRes);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTicketCreated = () => {
    loadData(true);
  };

  const handleTicketDeleted = (deletedId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== deletedId));
    fetchTicketStats().then(setStats);
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !searchQuery.trim() ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.description &&
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // If a ticket detail chat is opened
  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <TicketDetailChat
          initialTicket={selectedTicket}
          onBack={() => {
            setSelectedTicket(null);
            loadData(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <SupportHeader
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={() => loadData(true)}
        isRefreshing={refreshing}
      />

      {/* Stats Cards */}
      <SupportStats stats={stats} loading={loading} />

      {/* Section Title & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100/60 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Typography className="text-lg font-extrabold text-slate-900">
              {t("myTickets")}
            </Typography>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {filteredTickets.length}
            </span>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="pl-9 h-10 rounded-xl border-slate-200 text-xs focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-32 rounded-xl border-slate-200 text-xs">
                <SelectValue placeholder={t("statusPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">{t("statusAll")}</SelectItem>
                <SelectItem value="OPEN">{t("statusOpen")}</SelectItem>
                <SelectItem value="IN_PROGRESS">{t("statusInProgress")}</SelectItem>
                <SelectItem value="RESOLVED">{t("statusResolved")}</SelectItem>
                <SelectItem value="CLOSED">{t("statusClosed")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="h-10 w-32 rounded-xl border-slate-200 text-xs">
                <SelectValue placeholder={t("priorityPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="ALL">{t("priorityAll")}</SelectItem>
                <SelectItem value="LOW">{t("priorityLow")}</SelectItem>
                <SelectItem value="MEDIUM">{t("priorityMedium")}</SelectItem>
                <SelectItem value="HIGH">{t("priorityHigh")}</SelectItem>
                <SelectItem value="URGENT">{t("priorityUrgent")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tickets Grid / List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <LifeBuoy className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <Typography className="text-base font-bold text-slate-800">
                {t("noTicketsFound")}
              </Typography>
              <Typography className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "ALL" || priorityFilter !== "ALL"
                  ? t("noTicketsFilterHint")
                  : t("noTicketsEmptyHint")}
              </Typography>
            </div>

            {!searchQuery && statusFilter === "ALL" && priorityFilter === "ALL" && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white font-medium px-5 h-10 mt-2"
              >
                {t("createFirstTicket")}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onSelect={(t) => setSelectedTicket(t)}
                onDeleteClick={(t, e) => {
                  e.stopPropagation();
                  setTicketToDelete(t);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTicketCreated}
      />

      {/* Delete Ticket Modal */}
      <DeleteTicketModal
        ticket={ticketToDelete}
        onClose={() => setTicketToDelete(null)}
        onSuccess={handleTicketDeleted}
      />
    </div>
  );
}
