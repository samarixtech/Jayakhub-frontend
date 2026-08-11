import { useState, useEffect, useCallback } from "react";
import { getCurrentOrder } from "@/app/actions/customer/order";

export function useOrderTracking(orderIdFromUrl: string | undefined) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getCurrentOrder(orderIdFromUrl);
        if (response.success && response.data) {
          const resData = response.data as any;
          const orderData = resData.data ? resData.data : resData;
          setOrder(orderData);
        } else {
          console.error("Failed to load order:", response.message);
          setOrder(null);
        }
      } catch (error) {
        console.error("Error loading order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderIdFromUrl, refetchTrigger]);

  let subtotal = 0;
  let total = 0;
  let deliveryFee = 0;
  let coupon: any = null;
  let rider: any = null;

  if (order) {
    total = Number(order.totalAmount || 0);
    deliveryFee = Number(order.deliveryFee ?? 0);
    coupon = order.coupon ?? null;
    rider = order.rider ?? null;

    if (order.subtotal != null) {
      subtotal = Number(order.subtotal);
    } else {
      const itemsSubtotal = (order.items || []).reduce(
        (sum: number, item: any) =>
          sum + Number(item.price || 0) * (item.quantity || 1),
        0,
      );
      const dealsSubtotal = (order.deals || []).reduce(
        (sum: number, deal: any) =>
          sum +
          Number(deal.price || deal.dealPrice || deal.totalPrice || 0) *
            (deal.quantity || 1),
        0,
      );
      subtotal = itemsSubtotal + dealsSubtotal;
      if (subtotal === 0 && total > 0) {
        subtotal = Math.max(
          0,
          total - deliveryFee + (coupon?.discountAmount || 0),
        );
      }
    }
  }

  return {
    order,
    loading,
    subtotal,
    total,
    deliveryFee,
    coupon,
    rider,
    refetch,
  };
}
