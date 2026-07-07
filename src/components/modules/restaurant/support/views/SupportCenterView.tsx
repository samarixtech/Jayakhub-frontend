"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useSupportTickets } from "../hooks/useSupportTickets";
import type { Ticket } from "../support.types";
import { SupportSearchBanner } from "../components/SupportSearchBanner";
import { ContactCards } from "../components/ContactCards";
import { TicketsTable } from "../components/TicketsTable";
import { FAQSection } from "../components/FAQSection";
import CreateTicketDialog from "../components/CreateTicketDialog";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const SupportCenterView = () => {
  const t = useTranslations("RestaurantDashboard.Support");
  const { tickets, isLoading, refreshTickets } = useSupportTickets();
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const router = useRouter();

  const handleTicketClick = (ticket: Ticket) => {
    router.push(`/restaurant/support/${ticket.id}`);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12 animate-fadeSlide">
      {/* Page Header */}
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setTicketDialogOpen(true)}
          className="flex items-center gap-1.5 bg-[#2E6B56] hover:bg-[#255745] text-white text-[12px] font-bold px-5 py-2 rounded-full transition-colors shadow-sm tracking-wide"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
          {t("header.newTicket")}
        </button>
      </div>

      <SupportSearchBanner />

      <ContactCards />

      {/* Support Tickets */}
      <div className="mb-10">
        <TicketsTable
          tickets={tickets}
          isLoading={isLoading}
          onTicketClick={handleTicketClick}
          limit={5}
          onViewAll={() => router.push("/restaurant/support/all-tickets")}
        />
      </div>

      <FAQSection />

      {/* Modals / Sheets */}
      <CreateTicketDialog
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
        onTicketCreated={refreshTickets}
      />
    </div>
  );
};

export default SupportCenterView;

