import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import ProfileView from "@/components/modules/restaurant/settings/views/ProfileView";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import { Suspense } from "react";

async function ProfileData() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return <ProfileView settings={settings} />;
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<SettingsSkeleton />}>
        <ProfileData />
      </Suspense>
    </div>
  );
}
