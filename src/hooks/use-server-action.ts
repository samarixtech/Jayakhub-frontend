"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ActionResponse } from "@/lib/utils/response-handler";

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
