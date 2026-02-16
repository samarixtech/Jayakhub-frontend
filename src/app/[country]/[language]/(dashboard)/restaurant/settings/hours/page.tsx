import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { HoursTab } from "@/components/modules/restaurant/settings/tabs/HoursTab";

export default async function HoursPage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hours</h1>
        <p className="text-sm text-gray-500">Manage your opening hours.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <HoursTab settings={settings} />
      </div>
    </div>
  );
}
