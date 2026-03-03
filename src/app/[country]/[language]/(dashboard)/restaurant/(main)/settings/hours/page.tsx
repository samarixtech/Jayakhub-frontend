import { getAccountSettingsAction } from "@/app/actions/restaurant/settings";
import { HoursView } from "@/components/modules/restaurant/settings/views/HoursView";

export default async function HoursPage() {
  const settingsResponse = await getAccountSettingsAction();
  const settings = settingsResponse?.data || null;

  return (
    <div className="space-y-6">
      <HoursView settings={settings} />
    </div>
  );
}
