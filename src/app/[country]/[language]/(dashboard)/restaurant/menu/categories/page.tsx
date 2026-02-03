import { Metadata } from "next";
import MenuCategoriesView from "@/components/modules/restaurant/menu/categories/MenuCategoriesView";

export const metadata: Metadata = {
  title: "Categories | Restaurant Dashboard",
  description: "Manage menu categories",
};

export default function MenuCategoriesPage() {
  return <MenuCategoriesView />;
}
