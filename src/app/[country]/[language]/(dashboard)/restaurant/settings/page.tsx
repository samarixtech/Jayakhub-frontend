import { Metadata } from "next";
import SettingsView from "@/components/modules/restaurant/settings/SettingsView";

export const metadata: Metadata = {
  title: "Settings | Restaurant Dashboard",
  description: "Manage your restaurant profile, operations, and preferences.",
};

export default function SettingsPage() {
  return <SettingsView />;
}
