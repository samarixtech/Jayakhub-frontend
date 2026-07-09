"use server";
import { serverApi } from "@/components/services/api";

export async function getPosItems(category?: string, search?: string): Promise<{
  success: boolean;
  data: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    const query = params.toString();
    const url = query ? `/pos-item?${query}` : "/pos-item";

    const response = await api.get(url);

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch POS items",
      data: null,
    };
  }
}

export async function getItemVariantsAction(itemId: string): Promise<{
  success: boolean;
  data: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.get(`/item-variants/${itemId}`) as any;
    return { success: true, data: response.data?.data ?? response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to fetch item variants",
      data: null,
    };
  }
}

export async function getPOSDashboardAction(): Promise<{
  success: boolean;
  data: any;
  message: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.get("/pos-dashboard");
    const resData = response.data as any;

    return {
      success: true,
      data: resData?.data || resData,
      message: resData?.meta?.message || "Success",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch POS dashboard data",
      data: null,
    };
  }
}

export async function getPosStatsAction(): Promise<{
  success: boolean;
  data: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.get("/pos-stats");
    const resData = response.data as any;
    return { success: true, data: resData?.data ?? resData };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch POS stats",
      data: null,
    };
  }
}

export async function getPosOrdersFilteredAction(params?: {
  page?: number;
  limit?: number;
  orderType?: string;
  paymentMethod?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data: any[];
  pagination?: { page: number; limit: number; totalCount: number; totalPages: number };
  message?: string;
}> {
  try {
    const api = await serverApi();
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.orderType) query.set("orderType", params.orderType);
    if (params?.paymentMethod) query.set("paymentMethod", params.paymentMethod);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    const url = qs ? `/pos-orders-filtered?${qs}` : "/pos-orders-filtered";

    const response = await api.get(url);
    const resData = response.data as any;
    return {
      success: true,
      data: Array.isArray(resData?.data) ? resData.data : [],
      pagination: resData?.pagination,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch POS orders",
      data: [],
    };
  }
}
