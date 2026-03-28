"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { detectLocationAction } from "@/app/actions/public/detect";

export default function DetectLocationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function detect() {
      try {
        const result = await detectLocationAction();

        if (!mounted) return;

        let country = "pk";
        let language = "en";

        if (result.success && result.data) {
          country = result.data.code.toLowerCase();
          language = result.data.language.toLowerCase();
        } else if (result.fallback) {
          // Keep defaults
        } else {
          setError(result.message || "Detection failed");
          // Fallback anyway after delay?
          setTimeout(() => {
            const currentParams = searchParams.toString();
            const url = `/restaurants${currentParams ? `?${currentParams}` : ""}`;
            router.replace(url);
          }, 2000);
          return;
        }

        const currentParams = searchParams.toString();
        const url = `/restaurants${currentParams ? `?${currentParams}` : ""}`;
        router.replace(url);
      } catch (err) {
        console.error("Client detection error:", err);
        setError("Failed to detect location. Redirecting...");
        setTimeout(() => {
          const currentParams = searchParams.toString();
          const url = `/pk/en/restaurants${currentParams ? `?${currentParams}` : ""}`;
          router.replace(url);
        }, 1000);
      }
    }

    detect();

    return () => {
      mounted = false;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <p className="text-red-500 mb-2">{error}</p>
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* You can add a Logo here if you want */}
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-gray-500 text-sm font-medium animate-pulse">
          Detecting your location...
        </p>
      </div>
    </div>
  );
}
