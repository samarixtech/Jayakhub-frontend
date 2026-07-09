"use client";

import { useMemo } from "react";
import {
  canAccess,
  getClientPlanKeywords,
  getClientIsExpired,
  getClientIsCancelled,
  type PlanFeature,
  type PlanKeyword,
} from "@/lib/utils/abac";

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
  const isExpired = useMemo(() => getClientIsExpired(), []);
  const isCancelled = useMemo(() => getClientIsCancelled(), []);

  return {
    keywords,
    isExpired,
    isCancelled,
    can: (feature: PlanFeature) => canAccess(feature, keywords),
    hasKeyword: (keyword: PlanKeyword | string) => keywords.includes(keyword),
  };
}
