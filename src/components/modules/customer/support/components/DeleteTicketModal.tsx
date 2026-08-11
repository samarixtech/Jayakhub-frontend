"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SupportTicket } from "../types";
import { deleteTicket } from "../support-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface DeleteTicketModalProps {
  ticket: SupportTicket | null;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteTicketModal({
  ticket,
  onClose,
  onSuccess,
}: DeleteTicketModalProps) {
  const t = useTranslations("CustomerDashboard.Support");
  const [deleting, setDeleting] = useState(false);

  if (!ticket) return null;

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteTicket(ticket.id);
    setDeleting(false);

    if (res.success) {
      toast.success(t("deleteSuccessToast"));
      onSuccess(ticket.id);
      onClose();
    } else {
      toast.error(res.error || t("deleteFailToast"));
    }
  };

  return (
    <Dialog open={!!ticket} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white border-none shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-1">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {t("deleteDialogTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {t("deleteConfirmPrefix")}{" "}
            <span className="font-semibold text-slate-800">
              "{ticket.subject}"
            </span>
            ? {t("deleteConfirmSuffix")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl text-slate-500 hover:bg-slate-100"
          >
            {t("cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium px-6 h-11"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("deleting")}
              </>
            ) : (
              t("confirmDeleteBtn")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
