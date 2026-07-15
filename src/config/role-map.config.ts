export const ROLE_REDIRECT_MAP = {
  customer: "/restaurants",
  restaurant_owner: "/restaurant/status",
  cashier: "/restaurant/pos",
  admin: "/restaurant/dashboard",
  manager: "/restaurant/dashboard",
  kitchen: "/restaurant/pos/orders",
} as const;

export type UserRole = keyof typeof ROLE_REDIRECT_MAP;
