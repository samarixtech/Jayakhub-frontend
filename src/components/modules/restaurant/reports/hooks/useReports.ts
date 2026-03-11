"use client";
import { useEffect, useState } from "react";
import { getReportsAction } from "@/app/actions/restaurant/reports";

export const useReports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const result = await getReportsAction();
        if (result.success) {
          setData((result as any).data.data);
        }
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return {
    data,
    loading,
  };
};
