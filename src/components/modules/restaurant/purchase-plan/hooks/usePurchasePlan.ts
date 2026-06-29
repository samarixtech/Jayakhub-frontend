"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRestaurantPlansAction,
  checkoutPlanAction,
  RestaurantPlan,
} from "@/app/actions/public/plans";
import { useServerAction } from "@/hooks/use-server-action";

export function usePurchasePlan() {
  const router = useRouter();
  const [plans, setPlans] = useState<RestaurantPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await getRestaurantPlansAction();
        if (response.success && response.data) {
          setPlans(response.data);
        }
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
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
      onError: () => {
        setCheckingOutId(null);
      },
    },
  );

  const handleBuy = (planId: string) => {
    setCheckingOutId(planId);
    checkout(planId);
  };

  return {
    plans,
    loadingPlans,
    handleBuy,
    isCheckingOut,
    checkingOutId,
  };
}
