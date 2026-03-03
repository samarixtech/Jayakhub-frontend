import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import ProfileView from "@/components/modules/restaurant/settings/views/ProfileView";
import { SettingsSkeleton } from "@/components/skeletons/RestaurantSettingsSkeleton";
import { Suspense } from "react";

async function ProfileData() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  return <ProfileView settings={settings} imageBaseUrl={imageBaseUrl} />;
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
