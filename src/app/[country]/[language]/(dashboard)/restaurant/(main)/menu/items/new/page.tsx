import { Metadata } from "next";
import AddNewItemView from "@/components/modules/restaurant/menu/items/views/AddNewItemView";

export const metadata: Metadata = {
  title: "Add New Item | Menu Management",
  description: "Create a new menu item for your restaurant.",
};

export default function AddNewItemPage() {
  return <AddNewItemView />;
}
