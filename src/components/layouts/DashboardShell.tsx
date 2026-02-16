import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/app-sidebar";

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
      {/* FIX 1: Removed px-4 from this outer container so the header can span full width 
          FIX 2: Ensure w-full and h-screen are strictly enforced
      */}
      <div className="flex flex-col h-screen w-full bg-[#F9FAFB] overflow-hidden">
        {/* Header: Now full width, internal padding can be handled inside {header} */}
        <div className="w-full shrink-0 z-50">{header}</div>

        {/* Main Layout Area */}
        <div className="flex flex-1 flex-row min-h-0 overflow-hidden">
          {/* Sidebar Area: Added ml-4 (left margin) to provide spacing from the screen edge */}
          <div className="shrink-0 h-full ml-4">{sidebar}</div>

          {/* SidebarInset / Content Area 
              FIX 3: Use px-4 here to ensure the right-side space matches the left-side space 
          */}
          <SidebarInset className="flex flex-col bg-transparent flex-1 m-0 px-4 border-none overflow-hidden">
            <main className="flex-1 overflow-y-auto custom-scrollbar pt-6">
              <div className="h-full">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
