"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { ActionResponse } from "@/lib/utils/response-handler";

type ServerAction<TInput, TResponse> = (input: TInput) => Promise<ActionResponse<TResponse>>;

interface UseServerActionOptions<TResponse> {
  onSuccess?: (data?: TResponse) => void;
  onError?: (message: string) => void;
}

export function useServerAction<TInput, TResponse>(
  action: ServerAction<TInput, TResponse>,
  options: UseServerActionOptions<TResponse> = {}
) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResponse<TResponse> | null>(null);

  const execute = async (input: TInput) => {
    startTransition(async () => {
      try {
        const response = await action(input);
        setResult(response);

        if (response.success) {
          toast.success(response.message);
          options.onSuccess?.(response.data);
        } else {
          toast.error(response.message);
          options.onError?.(response.message);
        }
      } catch (error) {
        const msg = "An unexpected error occurred";
        toast.error(msg);
        options.onError?.(msg);
      }
    });
  };

  return {
    execute,
    isPending,
    result,
  };
}
