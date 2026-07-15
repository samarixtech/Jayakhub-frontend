"use server";

import { revalidatePath } from "next/cache";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export type PaymentCard = {
  last4: string;
  brand: string;
  name: string;
  expiry: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  type: string;
  monthlyPrice: string;
  billingCycle: string;
  keywords: string[];
  description: string;
};

export type SubscriptionDetails = {
  subscriptionId: string;
  status: string;
  isExpired: boolean;
  autoRenew: boolean;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  renewalDate: string;
  paidAmount?: number;
  paidCurrency?: string;
  convertedPrice?: number;
  convertedCurrency?: string;
  plan: SubscriptionPlan;
  paymentCard: PaymentCard | null;
};

export type BillingHistoryItem = {
  subscriptionId: string;
  planName: string;
  amount: string;
  currency: string;
  convertedPrice?: number | null;
  convertedCurrency?: string | null;
  status: string;
  autoRenew: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export async function getSubscriptionHistoryAction(): Promise<ActionResponse<BillingHistoryItem[]>> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get("/plan-subscriptions/my/history");
    },
    "Subscription history fetched successfully",
    async (data: any) => data?.history ?? [],
  );
}

export async function getSubscriptionDetailsAction(): Promise<ActionResponse<SubscriptionDetails>> {
  return responseHandler(
    async () => {
      const api = await serverApi();
      return api.get("/plan-subscriptions/my/details");
    },
    "Subscription details fetched successfully",
    async (data: any) => data?.planDetails ?? data,
  );
}

export async function toggleAutoRenewAction(autoRenew: boolean): Promise<ActionResponse> {
  const result = await responseHandler(
    async () => {
      const api = await serverApi();
      return api.patch("/plan-subscriptions/my/auto-renew", { autoRenew });
    },
    `Auto-renewal ${autoRenew ? "enabled" : "disabled"} successfully`,
  );
  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}

export async function cancelSubscriptionAction(): Promise<ActionResponse> {
  const result = await responseHandler(
    async () => {
      const api = await serverApi();
      return api.delete("/plan-subscriptions/my");
    },
    "Subscription cancelled successfully",
  );
  if (result.success) {
    revalidatePath("/", "layout");
  }
  return result;
}
