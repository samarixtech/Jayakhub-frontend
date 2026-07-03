export type PlanKeyword =
  | "pos_included"
  | "multi_role_2_staff"
  | "multi_role_5_staff"
  | "multi_role_unlimited"
  | "order_management"
  | "menu_items_50"
  | "menu_items_200"
  | "menu_items_unlimited"
  | "review_management_view"
  | "review_management_full"
  | "weekly_auto_payouts"
  | "instant_payouts"
  | "dedicated_ticket_support"
  | "finance_report_view"
  | "overall_report_view";

/**
 * Maps a feature name to the plan keywords that grant access to it.
 * If a user has ANY of the listed keywords, they have access.
 */
export const FEATURE_ACCESS_MAP = {
  // Sidebar tabs
  pos:             ["pos_included"],
  orders:          ["order_management"],
  menu_tab:        ["menu_items_50", "menu_items_200", "menu_items_unlimited"],
  reviews_tab:     ["review_management_view", "review_management_full"],
  finance_tab:     ["finance_report_view"],
  payouts_tab:     ["weekly_auto_payouts", "instant_payouts"],
  reports_tab:     ["overall_report_view"],
  support_tab:     ["dedicated_ticket_support"],
  staff_tab:       ["multi_role_2_staff", "multi_role_5_staff", "multi_role_unlimited"],
  // Feature-level gates
  reviews_manage:  ["review_management_full"],
  instant_payouts: ["instant_payouts"],
  // Alias kept for backwards compat in usePlanAccess consumers
  finance_reports: ["finance_report_view"],
  overall_reports: ["overall_report_view"],
  payouts:         ["weekly_auto_payouts", "instant_payouts"],
  staff_2:         ["multi_role_2_staff", "multi_role_5_staff", "multi_role_unlimited"],
  staff_5:         ["multi_role_5_staff", "multi_role_unlimited"],
  staff_unlimited: ["multi_role_unlimited"],
  menu_50:         ["menu_items_50", "menu_items_200", "menu_items_unlimited"],
  menu_200:        ["menu_items_200", "menu_items_unlimited"],
  menu_unlimited:  ["menu_items_unlimited"],
} as const satisfies Record<string, PlanKeyword[]>;

export type PlanFeature = keyof typeof FEATURE_ACCESS_MAP;

/** Returns true if userKeywords grant access to the given feature. */
export const canAccess = (
  feature: PlanFeature,
  userKeywords: string[],
): boolean => {
  const required = FEATURE_ACCESS_MAP[feature] as readonly string[];
  return required.some((k) => userKeywords.includes(k));
};

/** Parses the planKeywords cookie value into a string array.
 *  Handles raw JSON, single-encoded, or double-encoded values
 *  (double-encoding was a bug in earlier app versions). */
export const parseKeywordsFromCookie = (cookieValue: string | undefined): string[] => {
  if (!cookieValue) return [];
  let val = cookieValue;
  for (let i = 0; i <= 2; i++) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // not valid JSON yet — try one more decode
    }
    try {
      const decoded = decodeURIComponent(val);
      if (decoded === val) break; // no more percent-encoding left
      val = decoded;
    } catch {
      break; // malformed URI component
    }
  }
  return [];
};

/** Client-side: reads planKeywords directly from document.cookie. */
export const getClientPlanKeywords = (): string[] => {
  if (typeof document === "undefined") return [];
  const match = document.cookie.match(/(?:^|; )planKeywords=([^;]*)/);
  return parseKeywordsFromCookie(match?.[1]) ?? [];
};

/** Client-side: reads the isExpired cookie value. */
export const getClientIsExpired = (): boolean => {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/(?:^|; )isExpired=([^;]*)/);
  return match?.[1] === "true";
};

/** Server-side: reads planKeywords from Next.js cookies(). */
export const getServerPlanKeywords = async (): Promise<string[]> => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return parseKeywordsFromCookie(cookieStore.get("planKeywords")?.value);
};
