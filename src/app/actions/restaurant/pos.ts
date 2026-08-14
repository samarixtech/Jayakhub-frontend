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
  orderStatus?: string;
  source?: string;
  cashier?: string;
  startDate?: string;
  endDate?: string;
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
    if (params?.orderType && params.orderType !== "all") query.set("orderType", params.orderType);
    if (params?.paymentMethod && params.paymentMethod !== "all") query.set("paymentMethod", params.paymentMethod);
    if (params?.orderStatus && params.orderStatus !== "all") query.set("orderStatus", params.orderStatus);
    if (params?.source && params.source !== "all") query.set("source", params.source);
    if (params?.cashier) query.set("cashier", params.cashier);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    const url = qs ? `/pos-orders-filtered?${qs}` : "/pos-orders-filtered";

    const response = await api.get(url);
    const resData = response.data as any;
    return {
      success: true,
      data: Array.isArray(resData?.data) ? resData.data : [],
      pagination: resData?.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch POS orders",
      data: [],
    };
  }
}

export async function exportPosOrdersAction(params?: {
  format?: "xlsx" | "csv" | "csv-items" | "json";
  startDate?: string;
  endDate?: string;
  orderStatus?: string;
  orderType?: string;
  paymentMethod?: string;
  source?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: string;
  contentType?: string;
  filename?: string;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const query = new URLSearchParams();
    query.set("format", params?.format || "csv");
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.orderStatus) query.set("orderStatus", params.orderStatus);
    if (params?.orderType) query.set("orderType", params.orderType);
    if (params?.paymentMethod) query.set("paymentMethod", params.paymentMethod);
    if (params?.source) query.set("source", params.source);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString();
    const url = qs ? `/pos-orders-export?${qs}` : "/pos-orders-export";

    const response = await api.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const base64 = buffer.toString("base64");

    const format = params?.format || "csv";
    const ext = format === "json" ? "json" : format.startsWith("csv") ? "csv" : "xlsx";
    const contentType =
      ext === "json"
        ? "application/json"
        : ext === "csv"
        ? "text/csv"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `pos-orders-${dateStr}.${ext}`;

    return {
      success: true,
      data: base64,
      contentType,
      filename,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to export POS orders",
    };
  }
}

export async function downloadPosOrdersTemplateAction(
  format: "xlsx" | "csv" = "xlsx",
  type: "line-items" | "orders" = "line-items"
): Promise<{
  success: boolean;
  data?: string;
  contentType?: string;
  filename?: string;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.get(`/pos-orders-template?format=${format}&type=${type}`, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data);
    const base64 = buffer.toString("base64");
    const contentType =
      format === "csv"
        ? "text/csv"
        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const filename = `pos-orders-template.${format}`;

    return {
      success: true,
      data: base64,
      contentType,
      filename,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to download template",
    };
  }
}

export async function validatePosOrdersImportAction(formData: FormData): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const response = await api.post("/pos-orders-import?dryRun=true", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const resData = response.data as any;
    return {
      success: true,
      data: resData?.data ?? resData,
      message: resData?.meta?.message || resData?.message || "Validation complete",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.meta?.message || error?.response?.data?.message || error?.message || "Import validation failed",
      data: error?.response?.data?.data || null,
    };
  }
}

export async function commitPosOrdersImportAction(
  formData: FormData,
  autoCreateItems: boolean = false,
  preserveTimestamps: boolean = true
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const api = await serverApi();
    const query = new URLSearchParams({
      dryRun: "false",
      autoCreateItems: String(!!autoCreateItems),
      preserveTimestamps: String(!!preserveTimestamps),
    });
    const response = await api.post(`/pos-orders-import?${query.toString()}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const resData = response.data as any;
    return {
      success: true,
      data: resData?.data ?? resData,
      message: resData?.meta?.message || resData?.message || "Orders imported successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.meta?.message || error?.response?.data?.message || error?.message || "Failed to commit import",
    };
  }
}


