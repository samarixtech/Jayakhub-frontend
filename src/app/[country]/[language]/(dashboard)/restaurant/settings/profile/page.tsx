import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { ProfileTab } from "@/components/modules/restaurant/settings/tabs/ProfileTab";

export default async function ProfilePage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;
  const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500">
          Manage your profile settings here.
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ProfileTab settings={settings} imageBaseUrl={imageBaseUrl} />
      </div>
    </div>
  );
}
