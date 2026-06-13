"use server";
import { serverApi } from "@/components/services/api";
import { responseHandler, ActionResponse } from "@/lib/utils/response-handler";

export async function validateCouponAction(
  couponCode: string,
  orderTotal: number,
): Promise<ActionResponse> {
  const api = await serverApi();
  return responseHandler(
    async () => api.post("/validate-coupon", { couponCode, orderTotal }),
    undefined,
    async (data) => data,
  );
}
