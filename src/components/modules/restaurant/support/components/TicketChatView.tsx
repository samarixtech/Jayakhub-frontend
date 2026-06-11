"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, Send, Paperclip, Loader2, Clock, Flag, Hash, X } from "lucide-react";
import { getTicketDetailsAction, sendTicketMessageAction, getTicketMessagesAction } from "@/app/actions/restaurant/support";
import type { Ticket } from "../support.types";
import { StatusBadge } from "./StatusBadge";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface TicketChatViewProps {
  ticketId: string;
  onBack: () => void;
}

interface Message {
  id: string;
  senderName: string;
  avatarLetter: string;
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
  attachments?: string[] | null;
}

export default function TicketChatView({ ticketId, onBack }: TicketChatViewProps) {
  const t = useTranslations("RestaurantDashboard.Support.ticketChat");

  interface TicketDetails extends Ticket {
    restaurant?: {
      id: string;
      userId: string;
      name: string;
      ownerName: string;
      email: string;
      phone: string;
      address: string;
    };
  }

  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  // File Upload State
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Helper functions for attachments and display
  const getAttachmentUrl = (filePath: string) => {
    if (!filePath) return "";
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
    const cleanBase = baseUrl.replace(/\/+$/, "");
    const cleanPath = filePath.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${cleanBase}/${cleanPath}`;
  };

  const isImageUrl = (filePath: string) => {
    if (!filePath) return false;
    const ext = filePath.split(".").pop()?.toLowerCase();
    return ext ? ["jpg", "jpeg", "png", "webp", "gif"].includes(ext) : false;
  };

  const fetchMessagesOnly = useCallback(async (ticketDescription?: string, ownerName?: string, ticketCreatedAt?: string) => {
    try {
      const messagesRes = await getTicketMessagesAction(ticketId) as any;
      if (messagesRes.success) {
        const apiMessages = (messagesRes.data?.data?.messages || messagesRes.data?.messages || []) as any[];
        let mappedMessages: Message[] = apiMessages.map((msg) => ({
          id: msg.id,
          senderName: msg.senderName || "User",
          avatarLetter: (msg.senderName || "U").charAt(0).toUpperCase(),
          content: msg.body,
          createdAt: msg.createdAt,
          isCurrentUser: msg.senderType === "owner" || msg.senderId?.startsWith("OWN-"),
          attachments: msg.attachments || null,
        }));

        if (mappedMessages.length === 0 && ticketDescription) {
          const displayOwner = ownerName || "Muhammad Shoaib";
          mappedMessages = [{
            id: "initial-desc",
            senderName: displayOwner,
            avatarLetter: displayOwner.charAt(0).toUpperCase(),
            content: ticketDescription,
            createdAt: ticketCreatedAt || new Date().toISOString(),
            isCurrentUser: true,
            attachments: null,
          }];
        }
        setMessages(mappedMessages);
      } else if (ticketDescription) {
        // Fallback to description if API fails but description is available
        const displayOwner = ownerName || "Muhammad Shoaib";
        setMessages([{
          id: "initial-desc",
          senderName: displayOwner,
          avatarLetter: displayOwner.charAt(0).toUpperCase(),
          content: ticketDescription,
          createdAt: ticketCreatedAt || new Date().toISOString(),
          isCurrentUser: true,
          attachments: null,
        }]);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, [ticketId]);

  const fetchTicketDetails = useCallback(async () => {
    setLoading(true);
    try {
      const detailsRes = await getTicketDetailsAction(ticketId) as any;
      if (detailsRes.success && detailsRes.data?.data) {
        const ticketData = detailsRes.data.data as TicketDetails;
        setTicket(ticketData);

        await fetchMessagesOnly(
          ticketData.description,
          ticketData.restaurant?.ownerName,
          ticketData.createdAt
        );
      } else {
        toast.error(detailsRes.message || t("ticketNotFound"));
      }
    } catch {
      toast.error(t("ticketNotFound"));
    } finally {
      setLoading(false);
    }
  }, [ticketId, t, fetchMessagesOnly]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTicketDetails();
  }, [fetchTicketDetails]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      if (attachedFiles.length + newFiles.length > 5) {
        toast.error("You can upload a maximum of 5 files.");
        return;
      }

      const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf"];
      const invalidTypeFiles = newFiles.filter(file => {
        const fileExt = file.name.split(".").pop()?.toLowerCase();
        return !fileExt || !allowedExtensions.includes(fileExt);
      });

      if (invalidTypeFiles.length > 0) {
        toast.error("Only JPG, PNG, WEBP, and PDF files are allowed.");
        return;
      }

      const largeFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (largeFiles.length > 0) {
        toast.error("Each file must be under 5MB.");
        return;
      }

      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Reply Comment
  const handlePostComment = async () => {
    if (!replyText.trim() && attachedFiles.length === 0) {
      toast.error(t("placeholder"));
      return;
    }

    setSubmittingReply(true);

    try {
      const formData = new FormData();
      formData.append("body", replyText);
      attachedFiles.forEach((file) => {
        formData.append("ticketAttachment", file);
      });

      const res = await sendTicketMessageAction(ticketId, formData);

      if (res.success) {
        setReplyText("");
        setAttachedFiles([]);
        toast.success(t("postSuccess"));
        await fetchMessagesOnly(
          ticket?.description,
          ticket?.restaurant?.ownerName,
          ticket?.createdAt
        );
      } else {
        toast.error(res.message || t("postFailed"));
      }
    } catch {
      toast.error(t("postFailed"));
    } finally {
      setSubmittingReply(false);
    }
  };

  // Helper date formatter
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "text-red-500 bg-red-50 border-red-100";
      case "MEDIUM": return "text-amber-500 bg-amber-50 border-amber-100";
      case "LOW": return "text-gray-500 bg-gray-50 border-gray-100";
      default: return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#0b5d4e] animate-spin" />
        <p className="text-[14px] text-gray-500 mt-4">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-12 text-center">
        <p className="text-[14px] text-gray-500">{t("ticketNotFound")}</p>
        <button
          onClick={onBack}
          className="mt-4 inline-flex items-center gap-1.5 text-[#0b5d4e] font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-112px)] w-full max-w-[1200px] mx-auto animate-fadeSlide overflow-hidden">
      {/* Ticket Header — pinned at top, never scrolls */}
      <div className="shrink-0 mb-4 px-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-[#0b5d4e] hover:text-[#094d40] text-[13px] font-bold transition-colors shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back")}
              </button>
              <span className="text-gray-200 hidden sm:inline">|</span>
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold text-gray-500 shrink-0">
                <Hash className="w-3.5 h-3.5 text-gray-400" />
                <span>Ticket {ticket.id}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-1 border px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold ${getPriorityColor(ticket.priority)}`}>
                <Flag className="w-3.5 h-3.5" />
                <span>Priority {ticket.priority}</span>
              </div>

              <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold text-gray-500">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="max-w-[180px] sm:max-w-none truncate">Updated {formatDate(ticket.updatedAt)}</span>
              </div>

              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </div>

        <h2 className="text-[18px] sm:text-[20px] md:text-[24px] font-bold text-[#1a1a1a] leading-tight mt-1">
          {ticket.subject}
        </h2>
      </div>

      {/* Chat card — fills remaining height, no external scroll */}
      <div className="flex flex-col flex-1 overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm">
        {/* Conversation label */}
        <div className="shrink-0 px-4 md:px-6 pt-4 md:pt-5 pb-3 border-b border-gray-100">
          <h3 className="text-[11px] md:text-[12px] font-bold text-gray-400 uppercase tracking-wider">
            {t("conversation")}
          </h3>
        </div>

        {/* Scrollable messages — only this area scrolls */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 md:space-y-6 bg-gray-50/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[92%] sm:max-w-[85%] ${msg.isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-[12px] font-bold shrink-0 text-white shadow-sm ${msg.isCurrentUser ? "bg-[#0b5d4e]" : "bg-gray-400"}`}>
                {msg.avatarLetter}
              </div>

              <div className="flex flex-col min-w-0">
                <div
                  className={`rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-[13px] leading-relaxed text-[#2c2c2c] break-words ${msg.isCurrentUser
                    ? "bg-[#e8f4f1] rounded-tr-none border border-[#d2e9e3]"
                    : "bg-white rounded-tl-none border border-gray-100"
                    }`}
                >
                  <div>{msg.content}</div>

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.attachments.map((filePath, idx) => {
                        const url = getAttachmentUrl(filePath);
                        const isImg = isImageUrl(filePath);
                        const fileName = filePath.split("/").pop() || "Attachment";

                        if (isImg) {
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative block w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200 hover:opacity-90 transition-opacity bg-white"
                              title={fileName}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={url}
                                alt={fileName}
                                className="w-full h-full object-cover"
                              />
                            </a>
                          );
                        } else {
                          return (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 bg-white hover:bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-[#0b5d4e] transition-colors shadow-sm"
                              title={fileName}
                            >
                              <Paperclip className="w-3 h-3 text-gray-400" />
                              <span className="max-w-[100px] sm:max-w-[120px] truncate">{fileName}</span>
                            </a>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
                <div className={`text-[10px] text-gray-400 mt-1.5 flex items-center gap-1 ${msg.isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <span>{formatDate(msg.createdAt)}</span>
                  <span>•</span>
                  <span className="font-semibold">{msg.senderName}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply area — pinned to bottom of the card */}
        <div className="shrink-0 border-t border-gray-100 px-4 md:px-6 py-4">
          {ticket.status === "RESOLVED" ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center text-[13px] text-amber-700 font-medium animate-scaleIn">
              {t("resolvedMessage")}
            </div>
          ) : (
            <>
              <div className="border-2 border-[#0b5d4e] rounded-xl focus-within:ring-2 focus-within:ring-[#0b5d4e]/20 bg-white transition-all overflow-hidden flex flex-col shadow-sm">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t("placeholder")}
                  className="w-full min-h-[60px] md:min-h-[80px] text-[13px] px-4 pt-3 pb-2 placeholder-gray-400 focus:outline-none resize-none bg-transparent border-0 ring-0 focus:ring-0 focus:border-none leading-relaxed"
                />

                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/40">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 rounded-full hover:bg-gray-200/60 flex items-center justify-center transition-colors text-gray-500 hover:text-[#0b5d4e]"
                    title={t("browse")}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePostComment}
                    disabled={submittingReply || (!replyText.trim() && attachedFiles.length === 0)}
                    className="flex items-center gap-1.5 bg-[#0b5d4e] hover:bg-[#094d40] text-white text-[12px] font-bold px-4 py-2 rounded-full transition-colors shadow-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReply ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3 h-3" />
                        <span>{t("post")}</span>
                      </>
                    )}
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />
              </div>

              {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 animate-scaleIn">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium text-gray-600"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                      <span className="max-w-[120px] sm:max-w-[150px] truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachedFile(index);
                        }}
                        className="w-4.5 h-4.5 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
