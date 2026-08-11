import { Metadata } from "next";
import DealsBuilderView from "@/components/modules/restaurant/menu/deals/views/DealsBuilderView";

export const metadata: Metadata = {
  title: "Edit Deal | Menu Management",
  description: "Edit food combo deal or promotional discount bundle.",
};

interface EditDealPageProps {
  params: Promise<{
    dealId: string;
  }>;
}

export default async function EditDealPage({ params }: EditDealPageProps) {
  const { dealId } = await params;
  return <DealsBuilderView dealId={dealId} />;
}
