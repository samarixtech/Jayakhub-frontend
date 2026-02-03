import { Metadata } from "next";
import MenuVariantsView from "@/components/modules/restaurant/menu/variants/MenuVariantsView";

export const metadata: Metadata = {
  title: "Variant Groups | Restaurant Dashboard",
  description: "Manage variant groups and options",
};

export default function MenuVariantsPage() {
  return <MenuVariantsView />;
}
