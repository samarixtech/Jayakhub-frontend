"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ActionResponse } from "@/lib/utils/response-handler";

const AUTH_COOKIE_NAMES = ["token", "role", "planKeywords", "isExpired", "restaurantId"];

function isSessionExpiredResponse(response: ActionResponse<any>) {
  return (
    response.statusCode === 403 &&
    /session\s*expired/i.test(response.message || "")
  );
}

// The server action has already cleared cookies server-side (see api.ts's
// serverApi() interceptor); this just forces an immediate client redirect
// instead of waiting for the user's next navigation to hit proxy.ts's guard.
function handleSessionExpired() {
  AUTH_COOKIE_NAMES.forEach((name) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
  toast.error("Session Expired");
  window.location.href = "/login";
}

type ServerAction<TInput, TResponse> =
  | ((input: TInput) => Promise<ActionResponse<TResponse>>)
  | (() => Promise<ActionResponse<TResponse>>);

interface UseServerActionOptions<TResponse> {
  onSuccess?: (data?: TResponse, meta?: any) => void;
  onError?: (message: string) => void;
  suppressSuccessToast?: boolean;
}

export function useServerAction<TInput, TResponse>(
  action: ServerAction<TInput, TResponse>,
  options: UseServerActionOptions<TResponse> = {},
) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResponse<TResponse> | null>(null);

  // Use refs to keep action and options stable for useCallback
  const actionRef = useRef(action);
  const optionsRef = useRef(options);

  useEffect(() => {
    actionRef.current = action;
    optionsRef.current = options;
  }, [action, options]);

  const execute = useCallback(
    async (input?: TInput) => {
      startTransition(async () => {
        try {
          const response = await (actionRef.current as any)(input);
          setResult(response);

          if (isSessionExpiredResponse(response)) {
            handleSessionExpired();
            return;
          }

          if (response.success) {
            if (!optionsRef.current.suppressSuccessToast) {
              toast.success(response.message);
            }
            optionsRef.current.onSuccess?.(response.data, response.meta);
          } else {
            toast.error(response.message);
            optionsRef.current.onError?.(response.message);
          }
        } catch (error: any) {
          const msg = error?.response?.data?.message || error?.message;
          // toast.error(msg);
          optionsRef.current.onError?.(msg);
          console.error(msg);
        }
      });
    },
    [startTransition],
  );

  return {
    execute,
    isPending,
    result,
  };
}
