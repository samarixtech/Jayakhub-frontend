"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_PRIORITIES,
  TicketCategory,
  TicketPriority,
  CreateTicketPayload,
  PRIORITY_LABEL_KEY,
  CATEGORY_LABEL_KEY,
} from "../types";
import { createTicket } from "../support-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2, LifeBuoy } from "lucide-react";
import { toast } from "react-hot-toast";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTicketModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTicketModalProps) {
  const t = useTranslations("CustomerDashboard.Support");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TicketCategory>("Delivery");
  const [priority, setPriority] = useState<TicketPriority>("MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const resetForm = () => {
    setSubject("");
    setDescription("");
    setCategory("Delivery");
    setPriority("MEDIUM");
    setSubmitting(false);
    setShowSuccessDialog(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error(t("validationSubjectRequired"));
      return;
    }

    setSubmitting(true);
    const payload: CreateTicketPayload = {
      subject: subject.trim(),
      description: description.trim() || undefined,
      category,
      priority,
    };

    const res = await createTicket(payload);
    setSubmitting(false);

    if (res.success) {
      setShowSuccessDialog(true);
    } else {
      toast.error(res.error || t("createFailedToast"));
    }
  };

  const handleSuccessOk = () => {
    handleClose();
    onSuccess();
  };

  return (
    <>
      <Dialog open={isOpen && !showSuccessDialog} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 bg-white border-none shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
              <LifeBuoy className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              {t("createDialogTitle")}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {t("createDialogDesc")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {/* Subject */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t("subjectLabel")} <span className="text-red-500">*</span>
              </Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subjectPlaceholder")}
                className="rounded-xl h-11 border-slate-200 focus:border-primary text-sm"
                required
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {t("categoryLabel")}
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as TicketCategory)}
                >
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 text-sm w-full">
                    <SelectValue placeholder={t("categoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white">
                    {SUPPORT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {t(CATEGORY_LABEL_KEY[cat] || CATEGORY_LABEL_KEY.Other)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {t("priorityLabel")}
                </Label>
                <Select
                  value={priority}
                  onValueChange={(val) => setPriority(val as TicketPriority)}
                >
                  <SelectTrigger className="rounded-xl h-11 border-slate-200 text-sm w-full">
                    <SelectValue placeholder={t("priorityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl bg-white">
                    {SUPPORT_PRIORITIES.map((pri) => (
                      <SelectItem key={pri} value={pri}>
                        {t(PRIORITY_LABEL_KEY[pri] || PRIORITY_LABEL_KEY.MEDIUM)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {t("descriptionLabel")}
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descriptionPlaceholder")}
                rows={4}
                className="rounded-xl border-slate-200 focus:border-primary text-sm resize-none"
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={submitting}
                className="rounded-xl text-slate-500 hover:bg-slate-100"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={submitting || !subject.trim()}
                className="rounded-xl bg-primary hover:bg-primary/90 text-white font-medium px-6 h-11"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submitTicketBtn")
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessOk}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white border-none text-center shadow-2xl">
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-slate-900">
                {t("ticketCreatedTitle")}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {t("ticketCreatedDesc")}
              </p>
            </div>

            <Button
              onClick={handleSuccessOk}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 mt-4"
            >
              {t("okGotIt")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
