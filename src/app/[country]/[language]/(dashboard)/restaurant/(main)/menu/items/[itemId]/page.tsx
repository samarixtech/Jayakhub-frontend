import { Metadata } from "next";
import AddNewItemView from "@/components/modules/restaurant/menu/items/views/AddNewItemView";
export const metadata: Metadata = {
  title: "Edit Item | Restaurant Dashboard",
  description: "Edit menu item details.",
};

interface EditItemPageProps {
  params: Promise<{
    itemId: string;
  }>;
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { itemId } = await params;
  return <AddNewItemView />;
}
