import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import RestaurantHeader from "./RestaurantHeader";
import { RestaurantSidebar } from "./RestaurantSidebar";

export default function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-[#F9FAFB]">
        <RestaurantSidebar />
        <SidebarInset className="flex flex-col flex-1 min-w-0 bg-[#F9FAFB]">
          <RestaurantHeader />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
