import RestaurantDashboardLayout from "@/components/modules/restaurant/layout/RestaurantDashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RestaurantDashboardLayout>{children}</RestaurantDashboardLayout>;
}
