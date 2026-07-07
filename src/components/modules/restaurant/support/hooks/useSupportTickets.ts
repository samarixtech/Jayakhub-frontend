"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllTicketsAction } from "@/app/actions/restaurant/support";
import type { Ticket } from "../support.types";
import toast from "react-hot-toast";

export function useSupportTickets(initialParams?: {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ totalPages?: number; totalCount?: number } | null>(null);
  const [params, setParams] = useState(initialParams);

  const fetchTickets = useCallback(async (customParams?: typeof initialParams) => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setError(null);
    });
    try {
      const activeParams = customParams !== undefined ? customParams : params;
      const res = await getAllTicketsAction(activeParams);
      if (res.success && res.data) {
        const apiData = res.data as { data: Ticket[]; meta?: { totalPages?: number; totalCount?: number } };
        setTickets(apiData.data || []);
        setMeta(apiData.meta || null);
      } else {
        setError(res.message || "Failed to fetch tickets");
        toast.error(res.message || "Failed to fetch tickets");
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchTickets();
    });
  }, [fetchTickets]);

  return {
    tickets,
    isLoading,
    error,
    meta,
    params,
    setParams,
    refreshTickets: fetchTickets,
  };
}
