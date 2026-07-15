"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPosStatsAction,
  getPosOrdersFilteredAction,
} from "@/app/actions/restaurant/pos";
import { usePagination } from "@/hooks/usePagination";

export interface PosStats {
  totalOrders: number;
  totalSales: number;
  avgOrderValue: number;
  topSeller: {
    id: string;
    name: string;
    totalOrders: number;
  } | null;
}

export interface PosOrderItem {
  itemId: string;
  itemName: string;
  basePrice: number;
  quantity: number;
  discount?: number;
  variants?: { groupName: string; optionName: string; price: number }[];
  variantsTotal?: number;
  totalAmount: number;
}

export interface PosOrderRow {
  id: string;
  restaurantId: string;
  userId: string;
  tableName?: string | null;
  orderType: string;
  paymentMethod: string;
  orderStatus: string;
  notes?: string | null;
  items: PosOrderItem[];
  itemsTotal: number;
  deliveryFee: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
}

export function usePosHistory() {
  const [stats, setStats] = useState<PosStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [orders, setOrders] = useState<PosOrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [orderType, setOrderType] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { page, limit, totalPages, totalCount, handlePageChange, updatePaginationMeta } =
    usePagination({ initialLimit: 10 });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await getPosStatsAction();
        if (mounted && res.success && res.data) {
          setStats(res.data);
        }
      } finally {
        if (mounted) setStatsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Debounce search input to avoid firing a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 whenever a filter changes
  useEffect(() => {
    handlePageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderType, paymentMethod, status, debouncedSearch]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await getPosOrdersFilteredAction({
        page,
        limit,
        orderType: orderType === "all" ? undefined : orderType,
        paymentMethod: paymentMethod === "all" ? undefined : paymentMethod,
        orderStatus: status === "all" ? undefined : status,
        search: debouncedSearch || undefined,
      });
      if (res.success) {
        setOrders(res.data || []);
        if (res.pagination) {
          updatePaginationMeta(res.pagination);
        }
      }
    } finally {
      setOrdersLoading(false);
    }
  }, [page, limit, orderType, paymentMethod, status, debouncedSearch, updatePaginationMeta]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    stats,
    statsLoading,
    orders,
    ordersLoading,
    page,
    totalPages,
    totalCount,
    handlePageChange,
    orderType,
    setOrderType,
    paymentMethod,
    setPaymentMethod,
    status,
    setStatus,
    searchQuery,
    setSearchQuery,
  };
}
