import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { FinanceView } from "@/components/modules/restaurant/settings/views/FinanceView";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import { Suspense } from "react";

async function FinanceData() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return <FinanceView settings={settings} />;
}

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SettingsSkeleton />}>
        <FinanceData />
      </Suspense>
    </div>
  );
}
