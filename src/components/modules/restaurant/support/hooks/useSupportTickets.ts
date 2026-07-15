"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllTicketsAction } from "@/app/actions/restaurant/support";
import type { Ticket } from "../support.types";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("RestaurantDashboard.Support.hookToasts");

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
        setError(res.message || t("fetchFailed"));
        toast.error(res.message || t("fetchFailed"));
      }
    } catch {
      setError(t("unexpectedError"));
      toast.error(t("unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  }, [params, t]);

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
