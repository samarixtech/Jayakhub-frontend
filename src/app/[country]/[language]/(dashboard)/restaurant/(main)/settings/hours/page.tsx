import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { HoursView } from "@/components/modules/restaurant/settings/views/HoursView";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import { Suspense } from "react";

async function HoursData() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return <HoursView settings={settings} />;
}

export default function HoursPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SettingsSkeleton />}>
        <HoursData />
      </Suspense>
    </div>
  );
}
