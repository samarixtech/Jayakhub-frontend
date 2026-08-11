"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import {
  SupportTicket,
  TicketMessage,
  STATUS_COLORS,
  PRIORITY_COLORS,
  STATUS_LABEL_KEY,
  PRIORITY_LABEL_KEY,
} from "../types";
import {
  fetchTicketMessages,
  sendTicketMessage,
  resolveAttachmentUrl,
  isCustomerMessage,
} from "../support-service";
import {
  ArrowLeft,
  RefreshCw,
  Send,
  Paperclip,
  X,
  Image as ImageIcon,
  Headphones,
  Calendar,
  Tag,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { ImageLightboxModal } from "./ImageLightboxModal";

interface TicketDetailChatProps {
  initialTicket: SupportTicket;
  onBack: () => void;
}

export function TicketDetailChat({ initialTicket, onBack }: TicketDetailChatProps) {
  const t = useTranslations("CustomerDashboard.Support");
  const [ticket, setTicket] = useState<SupportTicket>(initialTicket);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form input states
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const statusStyle = STATUS_COLORS[ticket.status] || STATUS_COLORS.OPEN;
  const priorityStyle = PRIORITY_COLORS[ticket.priority] || PRIORITY_COLORS.MEDIUM;
  const statusLabel = t(STATUS_LABEL_KEY[ticket.status] || STATUS_LABEL_KEY.OPEN);
  const priorityLabel = t(PRIORITY_LABEL_KEY[ticket.priority] || PRIORITY_LABEL_KEY.MEDIUM);

  const scrollToBottom = (smooth = true) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    }, 100);
  };

  const loadMessages = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    const { ticket: fetchedTicket, messages: fetchedMessages } =
      await fetchTicketMessages(ticket.id);

    if (fetchedTicket) {
      setTicket((prev) => ({
        ...fetchedTicket,
        status: prev.status || fetchedTicket.status,
        priority: prev.priority || fetchedTicket.priority,
      }));
    }

    setMessages(fetchedMessages);
    setLoading(false);
    setRefreshing(false);
    scrollToBottom(false);
  };

  useEffect(() => {
    loadMessages();
  }, [ticket.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(t("imageOnlyError"));
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = textInput.trim();
    if (!trimmed) {
      if (selectedFile) {
        toast.error(t("textRequiredWithAttachment"));
      }
      return;
    }

    // Prepare Optimistic UI Message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: TicketMessage = {
      id: tempId,
      senderType: "customer",
      senderName: "You",
      body: trimmed,
      attachments: filePreview ? [filePreview] : [],
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };

    // Append Optimistic message locally
    setMessages((prev) => [...prev, optimisticMessage]);
    setTextInput("");
    const fileToUpload = selectedFile;
    removeSelectedFile();
    scrollToBottom(true);

    setSending(true);
    const res = await sendTicketMessage(ticket.id, trimmed, fileToUpload);
    setSending(false);

    if (res.success) {
      if (res.message) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? res.message! : msg))
        );
      } else {
        await loadMessages(true);
      }
    } else {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      toast.error(res.error || t("sendFailedToast"));
    }
  };

  const formattedTicketDate = ticket.createdAt
    ? (() => {
        try {
          return format(new Date(ticket.createdAt), "dd MMM yyyy, HH:mm");
        } catch {
          return ticket.createdAt;
        }
      })()
    : "";

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] bg-slate-50/50 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Headphones className="w-5 h-5 text-[#3B82F6]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Typography className="text-base font-bold text-slate-900 leading-none">
                {t("supportChatTitle")}
              </Typography>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${statusStyle.bg} ${statusStyle.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                {statusLabel}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              #{ticket.id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => loadMessages(true)}
          disabled={refreshing}
          className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw
            className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin text-primary" : ""}`}
          />
          {t("refresh")}
        </Button>
      </div>

      {/* Main Chat Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Ticket Summary Card Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {t("ticketDetailsLabel")}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded ${priorityStyle.bg} ${priorityStyle.text}`}
              >
                {priorityLabel} {t("priorityBadgeSuffix")}
              </span>
              {ticket.category && (
                <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5" />
                  {ticket.category}
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{ticket.subject}</h2>
            {ticket.description && (
              <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {ticket.description}
              </p>
            )}
          </div>

          {formattedTicketDate && (
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{t("createdPrefix")} {formattedTicketDate}</span>
            </div>
          )}
        </div>

        {/* Message Thread List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-slate-400 font-medium">{t("loadingChatHistory")}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <p className="text-sm font-semibold text-slate-700">{t("noMessagesYet")}</p>
            <p className="text-xs text-slate-400">
              {t("startConversationHint")}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = isCustomerMessage(msg.senderType);

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Agent Sender Name */}
                {!isMe && (
                  <span className="text-xs font-bold text-primary mb-1 ml-1">
                    {msg.senderName || t("supportAgentFallback")}
                  </span>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 shadow-sm space-y-2 ${
                    isMe
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-white text-slate-900 rounded-bl-none border border-slate-100"
                  } ${msg.isOptimistic ? "opacity-75" : ""}`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.body}
                  </p>

                  {/* Attachments rendering */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      {msg.attachments.map((att, idx) => {
                        const imgUrl = resolveAttachmentUrl(att);
                        if (!imgUrl) return null;

                        return (
                          <div
                            key={idx}
                            onClick={() => setLightboxImage(imgUrl)}
                            className="relative group cursor-pointer overflow-hidden rounded-xl border border-black/10 max-w-[220px] max-h-[180px]"
                          >
                            <img
                              src={imgUrl}
                              alt="Attachment"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                              {t("enlargeHint")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Time Stamp */}
                  <div
                    className={`text-[10px] text-right font-medium mt-1 ${
                      isMe ? "text-white/75" : "text-slate-400"
                    }`}
                  >
                    {msg.createdAt
                      ? (() => {
                          try {
                            return format(new Date(msg.createdAt), "HH:mm");
                          } catch {
                            return "";
                          }
                        })()
                      : ""}
                    {msg.isOptimistic && ` • ${t("sendingSuffix")}`}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white p-4 border-t border-slate-100 shrink-0">
        {/* Selected File Attachment Preview */}
        {filePreview && (
          <div className="mb-3 flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200 w-fit">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
              <img
                src={filePreview}
                alt={t("selectedPreviewAlt")}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                {selectedFile?.name}
              </p>
              <p className="text-slate-400">
                {(selectedFile!.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={removeSelectedFile}
              className="p-1 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-200 transition-colors ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className={`h-11 w-11 rounded-xl shrink-0 border-slate-200 ${
              selectedFile
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-slate-500 hover:bg-slate-50"
            }`}
            title={t("attachImageTooltip")}
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          {/* Text Input */}
          <Input
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t("messagePlaceholder")}
            className="flex-1 h-11 rounded-xl border-slate-200 focus:border-primary text-sm"
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={sending || !textInput.trim()}
            className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium shadow-sm"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
