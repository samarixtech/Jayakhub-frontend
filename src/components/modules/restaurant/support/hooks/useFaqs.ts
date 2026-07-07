"use client";

import { useState, useEffect } from "react";
import { getFaqsAction } from "@/app/actions/restaurant/support";

export interface FAQ {
  id: string;
  heading: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export function useFaqs() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFaqsAction().then((res) => {
      if (res.success && res.data) {
        const apiData = res.data as any;
        setFaqs(apiData.data || []);
      }
      setIsLoading(false);
    });
  }, []);

  return { faqs, isLoading };
}
