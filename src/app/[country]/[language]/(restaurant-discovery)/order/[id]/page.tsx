import OrderTrackingView from "@/components/modules/order/OrderTrackingView";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderTrackingView orderId={id} />;
}
