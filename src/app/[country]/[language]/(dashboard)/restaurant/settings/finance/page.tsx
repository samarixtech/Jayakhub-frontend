import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { FinanceTab } from "@/components/modules/restaurant/settings/tabs/FinanceTab";

export default async function FinancePage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
        <p className="text-sm text-gray-500">
          Manage your financial information.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <FinanceTab settings={settings} />
      </div>
    </div>
  );
}
