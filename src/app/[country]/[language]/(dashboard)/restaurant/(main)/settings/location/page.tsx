import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { LocationView } from "@/components/modules/restaurant/settings/views/LocationView";

export default async function LocationPage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <LocationView settings={settings} />
    </div>
  );
}
