import { SettingsSidebar } from "@/components/modules/restaurant/settings/components/SettingsSidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-0 sm:p-3 space-y-6 bg-gray-50/50 min-h-screen font-sans">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Restaurant Settings
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage your profile, operations, and preferences in one place.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Sidebar */}
        <SettingsSidebar />

        {/* Content Area */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
