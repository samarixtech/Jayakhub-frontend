import { Metadata } from "next";
import RestaurantSettingsView from "@/components/modules/restaurant/settings/RestaurantSettingsView";

export const metadata: Metadata = {
  title: "Settings | Restaurant Dashboard",
  description: "Manage your restaurant profile, operations, and preferences.",
};

export default function SettingsPage() {
  return <RestaurantSettingsView />;
}
