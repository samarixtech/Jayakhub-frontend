import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";

type DashboardShellProps = {
  header: React.ReactNode;
  children: React.ReactNode;
};

export default function DashboardShell({
  header,
  children,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full bg-[#F9FAFB] overflow-hidden px-4 gap-4">
        <div className="w-full shrink-0 z-50">{header}</div>
        <div className="flex flex-1 flex-row gap-4 min-h-0 overflow-hidden">
          <div className="shrink-0 h-full">
            <AppSidebar />
          </div>
          <SidebarInset className="flex flex-col bg-transparent flex-1 m-0 p-0 border-none overflow-hidden">
            <main className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="h-full">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
