import { Metadata } from "next";
import DealsBuilderView from "@/components/modules/restaurant/menu/deals/views/DealsBuilderView";

export const metadata: Metadata = {
  title: "Create New Deal | Menu Management",
  description: "Build a new food combo deal or promotional discount bundle.",
};

export default function NewDealPage() {
  return <DealsBuilderView />;
}
