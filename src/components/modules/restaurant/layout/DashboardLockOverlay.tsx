"use client";

import { usePathname } from "next/navigation";
import { usePlanAccess } from "@/hooks/use-plan-access";

export default function DashboardLockOverlay({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isExpired, isCancelled } = usePlanAccess();
  const isSubscriptionPage = pathname?.includes("/restaurant/subscription");
  const isBlocked = (isExpired || isCancelled) && !isSubscriptionPage;

  return (
    <div className="relative flex-1">
      <div className={isBlocked ? "pointer-events-none" : undefined}>
        {children}
      </div>
      {isBlocked && (
        <div
          className="absolute inset-0 bg-gray-400/10 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
