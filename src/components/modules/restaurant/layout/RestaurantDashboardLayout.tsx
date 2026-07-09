import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RestaurantHeader from "./RestaurantHeader";
import { RestaurantSidebar } from "./RestaurantSidebar";
import DashboardLockOverlay from "./DashboardLockOverlay";
import { DateFilterProvider } from "@/components/providers/DateFilterProvider";

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DateFilterProvider>
      <SidebarProvider>
        <div className="flex w-full min-h-screen bg-[#F9FAFB]">
          <RestaurantSidebar />
          <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#F9FAFB]">
            <RestaurantHeader />
            <main className="flex-1 p-6">
              <DashboardLockOverlay>{children}</DashboardLockOverlay>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DateFilterProvider>
  );
}

