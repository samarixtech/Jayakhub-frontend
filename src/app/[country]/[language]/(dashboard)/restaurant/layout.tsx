import RestaurantDashboardLayout from "@/components/modules/restaurant/layout/RestaurantDashboardLayout";
import SocketProvider from "@/components/providers/SocketProvider";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return (
    <SocketProvider token={token}>
      <RestaurantDashboardLayout>{children}</RestaurantDashboardLayout>
    </SocketProvider>
  );
}
