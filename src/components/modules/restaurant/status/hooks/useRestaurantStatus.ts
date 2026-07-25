"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { getRestaurantStatusAction } from "@/app/actions/restaurant/status";
import { useServerAction } from "@/hooks/use-server-action";

// Right after checkout redirects back here, the backend's payment webhook
// may not have landed yet — /my-restaurant can still report "pending" for a
// few seconds even though the plan was just paid for. Without a retry, the
// user was stuck on this page until they manually reloaded a couple of
// times (each reload re-checks and eventually catches the webhook having
// landed). Poll briefly instead so the redirect fires on its own.
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 10;

export function useRestaurantStatus() {
  const params = useParams<{ country: string; language: string }>();
  const [status, setStatus] = useState<
    "pending" | "rejected" | "active" | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fetchedRef = useRef(false);
  const isNewRef = useRef(false);
  const pollAttemptsRef = useRef(0);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { execute } = useServerAction(getRestaurantStatusAction, {
    suppressSuccessToast: true,
    onSuccess: (data: any) => {
      if (!data) return;

      const currentStatus = data.status;
      setStatus(currentStatus);
      setLoading(false);

      if (currentStatus === "active") {
        // Hard navigation instead of router.push: the dashboard layout
        // (header/sidebar/lock overlay) reads isCancelled/isExpired from
        // document.cookie once per mount via usePlanAccess. A soft
        // client-side transition can land there without that state actually
        // refreshing, leaving the dashboard looking locked until a manual
        // reload — a full navigation guarantees everything remounts fresh.
        window.location.href = `/${params.country}/${params.language}/restaurant/dashboard`;
        return;
      }

      if (
        isNewRef.current &&
        currentStatus !== "rejected" &&
        pollAttemptsRef.current < MAX_POLL_ATTEMPTS
      ) {
        pollAttemptsRef.current += 1;
        pollTimeoutRef.current = setTimeout(() => execute(), POLL_INTERVAL_MS);
      }
    },
    onError: (err) => {
      console.error("Failed to fetch status", err);
      setLoading(false);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newFlag =
        new URLSearchParams(window.location.search).get("new") === "true";
      setIsNew(newFlag);
      isNewRef.current = newFlag;
      if (newFlag) {
        const msg = sessionStorage.getItem("onboarding_success_message");
        if (msg) {
          setSuccessMessage(msg);
          sessionStorage.removeItem("onboarding_success_message");
        }
      }
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    execute();

    return () => {
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  return {
    status,
    loading,
    isNew,
    successMessage,
  };
}
