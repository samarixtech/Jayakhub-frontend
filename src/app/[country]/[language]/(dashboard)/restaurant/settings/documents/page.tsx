import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { DocumentsTab } from "@/components/modules/restaurant/settings/tabs/DocumentsTab";

export default async function DocumentsPage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Documents & Verification
        </h1>
        <p className="text-sm text-gray-500">
          Manage your verification documents.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DocumentsTab settings={settings} />
      </div>
    </div>
  );
}
