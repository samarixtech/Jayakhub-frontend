export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'PENDING';
export type TicketCategory = 'Payment' | 'Account' | 'Delivery' | 'Technical' | 'Other';

export interface SupportTicket {
  id: string;
  subject: string;
  description?: string;
  category?: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt?: string;
}

export interface TicketStats {
  total: number;
  pending: number;
  resolved: number;
  closed: number;
}

export interface TicketMessageAttachmentObject {
  url?: string;
  path?: string;
  file?: string;
  filename?: string;
  uri?: string;
  attachment?: string;
}

export type TicketMessageAttachment = string | TicketMessageAttachmentObject;

export interface TicketMessage {
  id: string;
  senderType: string; // "owner"|"customer"|"user"|"client" = customer, others = support agent
  senderName?: string;
  body: string;
  attachments?: TicketMessageAttachment[];
  createdAt: string;
  isOptimistic?: boolean;
}

export interface CreateTicketPayload {
  subject: string;
  description?: string;
  category?: string;
  priority?: TicketPriority;
}

export const SUPPORT_CATEGORIES: TicketCategory[] = [
  'Payment',
  'Account',
  'Delivery',
  'Technical',
  'Other',
];

export const SUPPORT_PRIORITIES: TicketPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

export const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  LOW: {
    bg: 'bg-blue-500/10',
    text: 'text-[#3B82F6]',
    border: 'border-blue-200',
    bar: '#3B82F6',
  },
  MEDIUM: {
    bg: 'bg-amber-500/10',
    text: 'text-[#F59E0B]',
    border: 'border-amber-200',
    bar: '#F59E0B',
  },
  HIGH: {
    bg: 'bg-red-500/10',
    text: 'text-[#EF4444]',
    border: 'border-red-200',
    bar: '#EF4444',
  },
  URGENT: {
    bg: 'bg-red-700/10',
    text: 'text-[#B91C1C]',
    border: 'border-red-400',
    bar: '#B91C1C',
  },
};

// Maps raw status/priority enum values to their CustomerDashboard.Support
// translation key, so t(STATUS_LABEL_KEY[ticket.status]) renders a properly
// localized badge instead of the raw enum text.
export const STATUS_LABEL_KEY: Record<string, string> = {
  OPEN: 'statusOpen',
  PENDING: 'statusPending',
  IN_PROGRESS: 'statusInProgress',
  RESOLVED: 'statusResolved',
  CLOSED: 'statusClosed',
};

export const PRIORITY_LABEL_KEY: Record<string, string> = {
  LOW: 'priorityLow',
  MEDIUM: 'priorityMedium',
  HIGH: 'priorityHigh',
  URGENT: 'priorityUrgent',
};

export const CATEGORY_LABEL_KEY: Record<string, string> = {
  Payment: 'categoryPayment',
  Account: 'categoryAccount',
  Delivery: 'categoryDelivery',
  Technical: 'categoryTechnical',
  Other: 'categoryOther',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  OPEN: {
    bg: 'bg-amber-500/12',
    text: 'text-[#F59E0B]',
    dot: 'bg-[#F59E0B]',
  },
  PENDING: {
    bg: 'bg-amber-500/12',
    text: 'text-[#F59E0B]',
    dot: 'bg-[#F59E0B]',
  },
  IN_PROGRESS: {
    bg: 'bg-blue-500/12',
    text: 'text-[#3B82F6]',
    dot: 'bg-[#3B82F6]',
  },
  RESOLVED: {
    bg: 'bg-emerald-500/12',
    text: 'text-[#10B981]',
    dot: 'bg-[#10B981]',
  },
  CLOSED: {
    bg: 'bg-slate-500/12',
    text: 'text-slate-500',
    dot: 'bg-slate-400',
  },
};
