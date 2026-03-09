"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useSupportTickets } from "../hooks/useSupportTickets";
import type { Ticket } from "../support.types";
import { SupportSearchBanner } from "../components/SupportSearchBanner";
import { ContactCards } from "../components/ContactCards";
import { TicketsTable } from "../components/TicketsTable";
import { KnowledgeBaseCategories } from "../components/KnowledgeBaseCategories";
import { FAQSection } from "../components/FAQSection";
import CreateTicketDialog from "../components/CreateTicketDialog";
import TicketDetailSheet from "../components/TicketDetailSheet";

const SupportCenterView = () => {
  const { tickets, isLoading, refreshTickets } = useSupportTickets();
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSheetOpen(true);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12">
      {/* Page Header */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setTicketDialogOpen(true)}
          className="flex items-center gap-1.5 bg-[#2E6B56] hover:bg-[#255745] text-white text-[12px] font-bold px-5 py-2 rounded-full transition-colors shadow-sm tracking-wide"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          New Ticket
        </button>
      </div>

      <SupportSearchBanner />

      <ContactCards />

      {/* Support Tickets + Knowledge Base */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        <TicketsTable
          tickets={tickets}
          isLoading={isLoading}
          onTicketClick={handleTicketClick}
        />
        <KnowledgeBaseCategories />
      </div>

      <FAQSection />

      {/* Modals / Sheets */}
      <CreateTicketDialog
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        onTicketCreated={refreshTickets}
      />
      <TicketDetailSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default SupportCenterView;
