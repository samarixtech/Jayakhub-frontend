import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import ProfileView from "@/components/modules/restaurant/settings/views/ProfileView";

export default async function ProfilePage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  return (
    <div className="space-y-6">
      <ProfileView settings={settings} imageBaseUrl={imageBaseUrl} />
    </div>
  );
}
