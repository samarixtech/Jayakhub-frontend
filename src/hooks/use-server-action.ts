"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";

type ActionFn<T, R> = (payload: T) => Promise<R>;

export function useServerAction<
  T,
  R extends { success: boolean; message: string },
>(
  action: ActionFn<T, R>,
  options?: {
    onSuccess?: (data: R) => void;
    onError?: (error: R) => void;
  },
) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<R | null>(null);

  const execute = async (payload: T) => {
    startTransition(async () => {
      const res = await action(payload);
      setResult(res);

      if (res.success) {
        if (res.message) toast.success(res.message);
        options?.onSuccess?.(res);
      } else {
        toast.error(res.message);
        options?.onError?.(res);
      }
    });
  };

  return { execute, isPending, result };
}
