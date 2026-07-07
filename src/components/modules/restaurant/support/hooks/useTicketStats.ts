"use client";

import { useState, useEffect } from "react";
import { getTicketStatsAction } from "@/app/actions/restaurant/support";

export interface TicketStats {
  total: number;
  pending: number;
  resolved: number;
  byPriority: {
    LOW?: number;
    MEDIUM?: number;
    HIGH?: number;
    URGENT?: number;
  };
  topPriority: string;
}

export function useTicketStats() {
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTicketStatsAction().then((res) => {
      if (res.success && res.data) {
        setStats(res.data as TicketStats);
      }
      setIsLoading(false);
    });
  }, []);

  return { stats, isLoading };
}
