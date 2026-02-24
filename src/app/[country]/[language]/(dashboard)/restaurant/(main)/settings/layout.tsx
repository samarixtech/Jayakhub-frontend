import { SettingsSidebar } from "@/components/modules/restaurant/settings/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-0 sm:p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar */}
        <SettingsSidebar />

        {/* Content Area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
