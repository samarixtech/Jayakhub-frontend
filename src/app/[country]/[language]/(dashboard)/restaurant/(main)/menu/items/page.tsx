import { Metadata } from "next";
import MenuItemsView from "@/components/modules/restaurant/menu/views/MenuItemsView";
export const metadata: Metadata = {
  title: "Menu Items | Restaurant Dashboard",
  description: "Manage your restaurant menu items",
};

export default function MenuItemsPage() {
  return <MenuItemsView />;
}
