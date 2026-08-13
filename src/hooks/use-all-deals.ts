"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getPublicDealsAction } from "@/app/actions/public/deals";
import { PublicDeal } from "@/components/modules/discovery/discovery.types";

export function useAllDeals(limit: number = 12) {
  const searchParams = useSearchParams();
  const [deals, setDeals] = useState<PublicDeal[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Helper to extract location params
  const getLocationParams = useCallback(() => {
    let lat: number | undefined;
    let lng: number | undefined;

    const urlLat = searchParams.get("lat");
    const urlLng = searchParams.get("lng");

    if (urlLat && urlLng) {
      lat = parseFloat(urlLat);
      lng = parseFloat(urlLng);
    } else {
      try {
        const cachedLoc = localStorage.getItem("userLocation");
        if (cachedLoc) {
          const parsed = JSON.parse(cachedLoc);
          if (parsed.lat && parsed.lng) {
            lat = parsed.lat;
            lng = parsed.lng;
          }
        }
      } catch (e) {}
    }

    return { lat, lng };
  }, [searchParams]);

  // Initial fetch (Page 1)
  useEffect(() => {
    let isMounted = true;
    const fetchInitialDeals = async () => {
      setIsLoading(true);
      setPage(1);
      setHasMore(true);
      try {
        const { lat, lng } = getLocationParams();
        const res = await getPublicDealsAction({ page: 1, limit, lat, lng });

        if (isMounted && res?.success && Array.isArray(res.data)) {
          setDeals(res.data);
          const meta = (res as any).meta;
          if (meta) {
            const totalPages =
              meta.totalPages ?? Math.ceil((meta.totalCount ?? 0) / limit);
            setHasMore(1 < totalPages && res.data.length >= limit);
          } else {
            setHasMore(res.data.length >= limit);
          }
        } else if (isMounted) {
          setDeals([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to fetch initial deals:", err);
        if (isMounted) {
          setDeals([]);
          setHasMore(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialDeals();

    return () => {
      isMounted = false;
    };
  }, [getLocationParams, limit]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (isFetchingMore || !hasMore || isLoading) return;

    setIsFetchingMore(true);
    const nextPage = page + 1;

    try {
      const { lat, lng } = getLocationParams();
      const res = await getPublicDealsAction({
        page: nextPage,
        limit,
        lat,
        lng,
      });

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setDeals((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const newItems = res.data.filter(
            (d: PublicDeal) => !existingIds.has(d.id),
          );
          return [...prev, ...newItems];
        });
        setPage(nextPage);

        const meta = (res as any).meta;
        if (meta) {
          const totalPages =
            meta.totalPages ?? Math.ceil((meta.totalCount ?? 0) / limit);
          setHasMore(nextPage < totalPages && res.data.length >= limit);
        } else {
          setHasMore(res.data.length >= limit);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to fetch more deals:", err);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [isFetchingMore, hasMore, isLoading, page, limit, getLocationParams]);

  return {
    deals,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
  };
}
