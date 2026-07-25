"use client";

import { useEffect, useMemo, useState } from "react";
import {
  canAccess,
  getClientPlanKeywords,
  getClientIsExpired,
  getClientIsCancelled,
  type PlanFeature,
  type PlanKeyword,
} from "@/lib/utils/abac";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";

/**
 * Returns helpers to check plan-based feature access on the client.
 *
 * @example
 * const { can, hasKeyword, keywords } = usePlanAccess();
 * can("pos")                    // true if plan includes pos_included
 * can("reviews_manage")         // true if plan includes review_management_full
 * hasKeyword("instant_payouts") // direct keyword check
 */
export function usePlanAccess() {
  const keywords = useMemo(() => getClientPlanKeywords(), []);
  const cookieIsExpired = useMemo(() => getClientIsExpired(), []);
  const cookieIsCancelled = useMemo(() => getClientIsCancelled(), []);
  const cookieSaysLocked = cookieIsExpired || cookieIsCancelled;

  // isExpired/isCancelled cookies only refresh on proxy.ts's throttled
  // (~60s) recheck or when a specific flow remembers to call this same
  // action — right after buying a plan, the cookie can still say
  // "cancelled" for a while even though /my-restaurant already confirms the
  // plan is active, locking a dashboard that shouldn't be locked. Re-verify
  // with the backend once whenever the cookie says locked, and self-correct
  // instead of waiting on a reload (or the 60s throttle) to catch up.
  const [revalidated, setRevalidated] = useState(false);
  const [fresh, setFresh] = useState<{
    isExpired: boolean;
    isCancelled: boolean;
  } | null>(null);

  useEffect(() => {
    if (!cookieSaysLocked || revalidated) return;
    setRevalidated(true);
    getRestaurantStatusAction().then((res) => {
      const data = res?.data as any;
      if (!data) return;
      const isExpired = data?.isExpired ?? data?.activePlan?.isExpired ?? false;
      const isCancelled = data?.isCancel ?? data?.activePlan?.isCancel ?? false;
      setFresh({ isExpired, isCancelled });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieSaysLocked, revalidated]);

  const isExpired = fresh ? fresh.isExpired : cookieIsExpired;
  const isCancelled = fresh ? fresh.isCancelled : cookieIsCancelled;

  return {
    keywords,
    isExpired,
    isCancelled,
    can: (feature: PlanFeature) => canAccess(feature, keywords),
    hasKeyword: (keyword: PlanKeyword | string) => keywords.includes(keyword),
  };
}
