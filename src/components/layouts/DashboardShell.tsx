import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

type DashboardShellProps = {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardShell({
  header,
  sidebar,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full bg-[#F9FAFB] overflow-hidden">
        <div className="w-full shrink-0 z-50">{header}</div>

        {/* Main Layout Area */}
        <div className="flex flex-1 flex-row min-h-0 overflow-hidden">
          {/* Sidebar Area */}
          <div className="shrink-0 h-full ml-0 sm:ml-4">{sidebar}</div>

          {/* SidebarInset / Content Area */}
          <SidebarInset className="flex flex-col bg-transparent flex-1 m-0 px-2 md:px-4 border-none overflow-hidden">
            <main className="flex-1 overflow-y-auto custom-scrollbar pt-6">
              <div className="h-full">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
