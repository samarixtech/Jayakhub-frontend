import { Metadata } from "next";
import DealsComboView from "@/components/modules/restaurant/menu/deals/views/DealsComboView";

export const metadata: Metadata = {
  title: "Deals & Combo Builder | Menu Management | Restaurant Dashboard",
  description:
    "Create and manage food combo bundles, deals, and special pricing offers for your restaurant.",
};

export default function DealsPage() {
  return <DealsComboView />;
}
