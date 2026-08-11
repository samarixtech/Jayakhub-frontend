import {
  createTicketAction,
  deleteTicketAction,
  getTicketMessagesAction,
  getTicketsAction,
  getTicketStatsAction,
  sendTicketMessageAction,
} from "@/app/actions/customer/support";
import {
  CreateTicketPayload,
  SupportTicket,
  TicketMessage,
  TicketMessageAttachment,
  TicketMessageAttachmentObject,
  TicketStats,
} from "./types";

const SERVER_BASE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api\/v1\/?$/, "") ||
  "https://app.jayakhub.com";

/**
 * Normalizes and builds full URL for ticket attachments
 */
export function resolveAttachmentUrl(attachment: TicketMessageAttachment): string {
  let pathStr = "";

  if (typeof attachment === "string") {
    pathStr = attachment;
  } else if (attachment && typeof attachment === "object") {
    const obj = attachment as TicketMessageAttachmentObject;
    pathStr =
      obj.url ||
      obj.path ||
      obj.file ||
      obj.filename ||
      obj.uri ||
      obj.attachment ||
      "";
  }

  if (!pathStr) return "";

  if (pathStr.startsWith("http://") || pathStr.startsWith("https://") || pathStr.startsWith("data:")) {
    return pathStr;
  }

  const cleanServerUrl = SERVER_BASE_URL.replace(/\/+$/, "");
  const cleanPath = pathStr.replace(/^\/+/, "");
  return `${cleanServerUrl}/${cleanPath}`;
}

/**
 * Checks if a message sender is the customer
 */
export function isCustomerMessage(senderType?: string): boolean {
  if (!senderType) return true;
  const lower = senderType.trim().toLowerCase();
  return ["owner", "customer", "user", "client"].includes(lower);
}

/**
 * Defensive Ticket normalization
 */
function normalizeTicket(raw: any): SupportTicket {
  return {
    id: String(raw.id || raw._id || ""),
    subject: raw.subject || "Untitled Ticket",
    description: raw.description || "",
    category: raw.category || raw.categoryName || raw.category_name || "Other",
    priority: (raw.priority || "MEDIUM").toString().toUpperCase() as any,
    status: (raw.status || "OPEN").toString().toUpperCase() as any,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
  };
}

/**
 * Defensive Message normalization
 */
function normalizeMessage(raw: any): TicketMessage {
  const rawAttachments =
    raw.attachments ||
    raw.attachment ||
    raw.images ||
    raw.image ||
    raw.files ||
    raw.file ||
    raw.media ||
    [];

  const attachmentsArray = Array.isArray(rawAttachments)
    ? rawAttachments
    : [rawAttachments].filter(Boolean);

  return {
    id: String(raw.id || raw._id || Math.random().toString(36).substring(2)),
    senderType: raw.senderType || raw.sender_type || "customer",
    senderName: raw.senderName || raw.sender_name || "Support Agent",
    body: raw.body || raw.message || "",
    attachments: attachmentsArray,
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
  };
}

/**
 * Fetch Ticket Stats
 */
export async function fetchTicketStats(): Promise<TicketStats> {
  try {
    const res = await getTicketStatsAction();
    if (!res.success) return { total: 0, pending: 0, resolved: 0, closed: 0 };
    const data = res.data || {};
    return {
      total: Number(data.total ?? 0),
      pending: Number(data.pending ?? 0),
      resolved: Number(data.resolved ?? 0),
      closed: Number(data.closed ?? 0),
    };
  } catch (error) {
    console.error("Error fetching ticket stats:", error);
    return { total: 0, pending: 0, resolved: 0, closed: 0 };
  }
}

/**
 * Fetch List of User Tickets
 */
export async function fetchTickets(
  page: number = 1,
  limit: number = 20,
  status?: string,
  priority?: string
): Promise<SupportTicket[]> {
  try {
    const res = await getTicketsAction(page, limit, status, priority);
    if (!res.success) return [];
    const rawList = res.data || [];
    const items = Array.isArray(rawList) ? rawList : [];
    return items.map(normalizeTicket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

/**
 * Fetch Messages Thread & Ticket Info
 */
export async function fetchTicketMessages(
  ticketId: string
): Promise<{ ticket?: SupportTicket; messages: TicketMessage[] }> {
  try {
    const res = await getTicketMessagesAction(ticketId);
    if (!res.success) return { messages: [] };

    const payload = res.data || {};
    const rawTicket = payload.ticket || payload.customerTicket;
    const rawMessages = payload.messages || payload.ticketMessages || [];

    const messages = Array.isArray(rawMessages)
      ? rawMessages.map(normalizeMessage)
      : [];

    return {
      ticket: rawTicket ? normalizeTicket(rawTicket) : undefined,
      messages,
    };
  } catch (error) {
    console.error(`Error fetching messages for ticket ${ticketId}:`, error);
    return { messages: [] };
  }
}

/**
 * Create New Ticket
 */
export async function createTicket(payload: CreateTicketPayload): Promise<{ success: boolean; data?: SupportTicket; error?: string }> {
  try {
    const body: {
      subject: string;
      description?: string;
      category?: string;
      priority?: string;
    } = {
      subject: payload.subject.trim(),
    };
    if (payload.description?.trim()) body.description = payload.description.trim();
    if (payload.category) body.category = payload.category;
    if (payload.priority) body.priority = payload.priority;

    const res = await createTicketAction(body);
    if (!res.success) {
      return { success: false, error: res.message || "Failed to create ticket" };
    }

    return {
      success: true,
      data: res.data ? normalizeTicket(res.data) : undefined,
    };
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    return { success: false, error: error.message || "Failed to create ticket" };
  }
}

/**
 * Send Ticket Message (with optional attachment)
 */
export async function sendTicketMessage(
  ticketId: string,
  bodyText: string,
  attachmentFile?: File | null
): Promise<{ success: boolean; message?: TicketMessage; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("body", bodyText);

    if (attachmentFile) {
      formData.append("ticketAttachment", attachmentFile);
    }

    const res = await sendTicketMessageAction(ticketId, formData);
    if (!res.success) {
      return { success: false, error: res.message || "Failed to send message" };
    }

    const data =
      res.data?.message ||
      res.data?.ticketMessage ||
      res.data;

    return {
      success: true,
      message: data ? normalizeMessage(data) : undefined,
    };
  } catch (error: any) {
    console.error(`Error sending message for ticket ${ticketId}:`, error);
    return { success: false, error: error.message || "Failed to send message" };
  }
}

/**
 * Delete Ticket
 */
export async function deleteTicket(ticketId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await deleteTicketAction(ticketId);
    if (!res.success) {
      return { success: false, error: res.message || "Failed to delete ticket" };
    }
    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting ticket ${ticketId}:`, error);
    return { success: false, error: error.message || "Failed to delete ticket" };
  }
}
