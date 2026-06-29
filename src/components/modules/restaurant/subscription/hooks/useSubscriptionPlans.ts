"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRestaurantPlansAction,
  checkoutPlanAction,
  type RestaurantPlan,
} from "@/app/actions/public/plans";
import { getSubscriptionDetailsAction, type SubscriptionDetails } from "@/app/actions/restaurant/subscription";
import { useServerAction } from "@/hooks/use-server-action";

export function useSubscriptionPlans() {
  const router = useRouter();
  const [plans, setPlans] = useState<RestaurantPlan[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [plansRes, subRes] = await Promise.all([
        getRestaurantPlansAction(),
        getSubscriptionDetailsAction(),
      ]);
      if (plansRes.success && plansRes.data) setPlans(plansRes.data);
      if (subRes.success && subRes.data) setSubscription(subRes.data);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const { execute: checkout, isPending: isCheckingOut } = useServerAction(
    checkoutPlanAction,
    {
      onSuccess: (data: any) => {
        const checkoutUrl = data?.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          router.push("/restaurant/status?new=true");
        }
      },
      onError: () => setCheckingOutId(null),
    },
  );

  const handleCheckout = (planId: string) => {
    setCheckingOutId(planId);
    checkout(planId);
  };

  return {
    plans,
    subscription,
    loading,
    isCheckingOut,
    checkingOutId,
    handleCheckout,
  };
}
