"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getSubscriptionDetailsAction,
  getSubscriptionHistoryAction,
  type SubscriptionDetails,
  type BillingHistoryItem,
} from "@/app/actions/restaurant/subscription";

export const KEYWORD_LABELS: Record<string, string> = {
  pos_included:            "POS System Included",
  order_management:        "Order Management",
  weekly_auto_payouts:     "Weekly Auto Payouts",
  instant_payouts:         "Instant Payouts",
  finance_report_view:     "Finance Reports",
  overall_report_view:     "Full Reporting Suite",
  dedicated_ticket_support:"Priority Support",
  review_management_view:  "Review Management (View)",
  review_management_full:  "Full Review Management",
  multi_role_2_staff:      "Up to 2 Staff Members",
  multi_role_5_staff:      "Up to 5 Staff Members",
  multi_role_unlimited:    "Unlimited Staff Members",
  menu_items_50:           "Up to 50 Menu Items",
  menu_items_200:          "Up to 200 Menu Items",
  menu_items_unlimited:    "Unlimited Menu Items",
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [history, setHistory] = useState<BillingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSubscriptionDetailsAction();
      if (res.success && res.data) {
        setSubscription(res.data);
      } else {
        setError(res.message || "Failed to load subscription details");
      }
    } catch {
      setError("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await getSubscriptionHistoryAction();
      if (res.success && res.data) {
        setHistory(res.data);
      }
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchDetails();
    fetchHistory();
  }, [fetchDetails, fetchHistory]);

  const totalDays = subscription
    ? Math.max(
        1,
        Math.ceil(
          (new Date(subscription.endDate).getTime() -
            new Date(subscription.startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 30;

  const progressPercent = subscription
    ? Math.round(((totalDays - subscription.daysRemaining) / totalDays) * 100)
    : 0;

  const featureLabels =
    subscription?.plan.keywords.map(
      (k) => KEYWORD_LABELS[k] ?? k.replace(/_/g, " "),
    ) ?? [];

  const renewalDateFormatted = subscription?.renewalDate
    ? new Date(subscription.renewalDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return {
    subscription,
    history,
    loading,
    loadingHistory,
    error,
    progressPercent,
    featureLabels,
    renewalDateFormatted,
    totalDays,
    refetch: fetchDetails,
  };
}
