import RestaurantDashboardLayout from "@/components/modules/restaurant/layout/RestaurantDashboardLayout";

export default function MainRestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RestaurantDashboardLayout>{children}</RestaurantDashboardLayout>;
}
