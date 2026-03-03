import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import DocumentsView from "@/components/modules/restaurant/settings/views/DocumentsView";

export default async function DocumentsPage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DocumentsView settings={settings} />
      </div>
    </div>
  );
}
