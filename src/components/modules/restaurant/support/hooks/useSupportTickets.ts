"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllTicketsAction } from "@/app/actions/restaurant/support";
import type { Ticket } from "../support.types";
import toast from "react-hot-toast";

export function useSupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getAllTicketsAction();
      if (res.success && res.data) {
        const apiData = res.data as any;
        setTickets(apiData.data || []);
        setMeta(apiData.meta || null);
      } else {
        setError(res.message || "Failed to fetch tickets");
        toast.error(res.message || "Failed to fetch tickets");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    isLoading,
    error,
    meta,
    refreshTickets: fetchTickets,
  };
}
