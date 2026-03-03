import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { LocationView } from "@/components/modules/restaurant/settings/views/LocationView";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import { Suspense } from "react";

async function LocationData() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return <LocationView settings={settings} />;
}

export default function LocationPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SettingsSkeleton />}>
        <LocationData />
      </Suspense>
    </div>
  );
}
