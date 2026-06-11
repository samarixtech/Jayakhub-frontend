"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */

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

export async function getTicketDetailsAction(id: string) {
  try {
    const api = await serverApi();
    const response = await api.get(`/ticket/${id}`);
    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Fetch ticket details error for ${id}:`, error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to fetch ticket details",
    };
  }
}

export async function sendTicketMessageAction(ticketId: string, formData: FormData) {
  try {
    const api = await serverApi();
    const response = await api.post(`/ticket/${ticketId}/messages`, formData);
    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Send ticket message error for ${ticketId}:`, error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to send message",
    };
  }
}

export async function getTicketMessagesAction(id: string) {
  try {
    const api = await serverApi();
    const response = await api.get(`/ticket/${id}/messages`);
    return {
      success: true as const,
      data: response.data,
    };
  } catch (error: any) {
    console.error(`Fetch ticket messages error for ${id}:`, error);
    return {
      success: false as const,
      data: null,
      message: error.response?.data?.message || "Failed to fetch messages",
    };
  }
}

