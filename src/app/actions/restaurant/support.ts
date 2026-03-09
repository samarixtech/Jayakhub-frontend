"use server";

import { serverApi } from "@/components/services/api";

export async function getAllTicketsAction() {
  try {
    const api = await serverApi();
    const response = await api.get("/all-tickets");
    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Fetch tickets error:", error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to fetch tickets",
    };
  }
}

interface CreateTicketPayload {
  subject: string;
  description: string;
  priority: string;
  category: string;
}

export async function createTicketAction(payload: CreateTicketPayload) {
  try {
    const api = await serverApi();
    const response = await api.post("/create-ticket", payload);
    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error("Create ticket error:", error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to create ticket",
    };
  }
}
