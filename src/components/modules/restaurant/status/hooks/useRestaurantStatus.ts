"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { useServerAction } from "@/hooks/use-server-action";

export function useRestaurantStatus() {
  const router = useRouter();
  const [status, setStatus] = useState<
    "pending" | "rejected" | "active" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const fetchedRef = useRef(false);

  const { execute } = useServerAction(getRestaurantStatusAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      if (!data) return;

      const currentStatus = data.status;
      setStatus(currentStatus);
      setLoading(false);

      if (currentStatus === "active") {
        router.push(`/restaurant/dashboard`);
      }
    },
    onError: (err) => {
      console.error("Failed to fetch status", err);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;
   
    execute();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsNew(
        new URLSearchParams(window.location.search).get("new") === "true",
      );
    }
  }, []);

  return {
    status,
    loading,
    isNew,
  };
}
