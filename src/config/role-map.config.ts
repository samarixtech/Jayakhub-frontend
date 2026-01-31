export const ROLE_REDIRECT_MAP = {
  customer: "/customer/dashboard",
  restaurant_owner: "/restaurant/status",
  admin: "/admin/dashboard",
} as const;

export type UserRole = keyof typeof ROLE_REDIRECT_MAP;
