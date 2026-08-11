"use server";
import { serverApi } from "@/components/services/api";

export async function createTicketAction(payload: {
  subject: string;
  description?: string;
  category?: string;
  priority?: string;
}) {
  try {
    const api = await serverApi();
    const response = await api.post("/customer-ticket/create", payload);
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.response?.data?.meta?.message ||
        error?.message ||
        "Failed to create ticket",
    };
  }
}

export async function getTicketStatsAction() {
  try {
    const api = await serverApi();
    const response = await api.get("/customer-ticket/stats");
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch stats",
    };
  }
}

export async function getTicketsAction(page = 1, limit = 20, status?: string, priority?: string) {
  try {
    const api = await serverApi();
    const params: Record<string, any> = { page, limit };
    if (status) params.status = status;
    if (priority) params.priority = priority;

    const response = await api.get("/customer-ticket/all", { params });
    return { success: true, data: response.data?.data || response.data?.tickets || response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch tickets",
    };
  }
}

export async function getTicketMessagesAction(ticketId: string) {
  try {
    const api = await serverApi();
    const response = await api.get(`/customer-ticket/${ticketId}/messages`);
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch messages",
    };
  }
}

export async function sendTicketMessageAction(ticketId: string, formData: FormData) {
  try {
    const api = await serverApi();
    const response = await api.post(`/customer-ticket/${ticketId}/messages`, formData);
    return { success: true, data: response.data?.data || response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to send message",
    };
  }
}

export async function deleteTicketAction(ticketId: string) {
  try {
    const api = await serverApi();
    const response = await api.delete(`/customer-ticket/${ticketId}`);
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to delete ticket",
    };
  }
}
