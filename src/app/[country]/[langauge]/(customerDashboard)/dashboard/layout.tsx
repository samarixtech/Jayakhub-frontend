// app/dashboard/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import ProtectedRoute from "@/components/services/ProtectedRoutes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#FFF9EE]">
        <AppSidebar />

        <main className="flex-1 flex flex-col min-w-0">
          {/* Header Area */}
          <header className="flex h-16 items-center gap-2 border-b bg-white px-4 shrink-0">
            <SidebarTrigger className="text-[#0B5D4E]" />
            <div className="h-4 w-[1px] bg-gray-200 mx-2" />
            <h2 className="text-sm font-medium text-gray-500">
              User Dashboard
            </h2>
          </header>

          <div className="flex-1 p-6 overflow-auto">
            {/* <ProtectedRoute> */}
            {children}
            {/* </ProtectedRoute> */}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
