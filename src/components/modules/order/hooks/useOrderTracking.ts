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

  if (order && order.items) {
    subtotal = order.items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * item.quantity,
      0,
    );
    total = Number(order.totalAmount);
    deliveryFee = order.deliveryFee ?? 0;
    coupon = order.coupon ?? null;
    rider = order.rider ?? null;
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
