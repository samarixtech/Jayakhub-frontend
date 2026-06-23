"use server";
import { serverApi } from "@/components/services/api";

export async function getPosItems(category?: string): Promise<{
  success: boolean;
  data: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const url =
      category && category !== "all"
        ? `/pos-item?category=${encodeURIComponent(category)}`
        : "/pos-item";

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
