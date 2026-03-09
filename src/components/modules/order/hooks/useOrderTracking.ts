import { useState, useEffect } from "react";
import { getCurrentOrder } from "@/app/actions/customer/order";

export function useOrderTracking(orderIdFromUrl: string | undefined) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await getCurrentOrder(orderIdFromUrl);
        if (response.success && response.data) {
          // If the backend wraps the object in a "data" property, unwrap it
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
  }, [orderIdFromUrl]);

  let subtotal = 0;
  let total = 0;
  let deliveryFee = 0;

  if (order && order.items) {
    subtotal = order.items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * item.quantity,
      0,
    );
    total = Number(order.totalAmount);
    deliveryFee = total > subtotal ? total - subtotal : 0;
  }

  return {
    order,
    loading,
    subtotal,
    total,
    deliveryFee,
  };
}
