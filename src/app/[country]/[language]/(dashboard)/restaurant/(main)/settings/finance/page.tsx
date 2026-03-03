import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { FinanceView } from "@/components/modules/restaurant/settings/views/FinanceView";

export default async function FinancePage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <FinanceView settings={settings} />
    </div>
  );
}
