"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { createTicketAction } from "@/app/actions/restaurant/support";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated: () => void;
}

const CreateTicketDialog = ({
  open,
  onOpenChange,
  onTicketCreated,
}: CreateTicketDialogProps) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations("RestaurantDashboard.Support.createTicket");

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createTicketAction({
        subject,
        description,
        priority,
        category,
      });
      if (res.success) {
        toast.success(t("success"));
        setSubject("");
        setDescription("");
        setPriority("MEDIUM");
        setCategory("");
        onOpenChange(false);
        onTicketCreated();
      } else {
        toast.error(res.message || t("errorFailed"));
      }
    } catch {
      toast.error(t("errorUnexpected"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0 rounded-2xl gap-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-[18px] font-bold text-[#1a1a1a]">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-4 space-y-5">
          <div>
            <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">
              {t("subjectLabel")}
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("subjectPlaceholder")}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors"
            />
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">
              {t("priorityLabel")}
            </label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full h-10 rounded-lg border border-gray-200 text-[13px] text-gray-700 focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20">
                <SelectValue placeholder={t("prioritySelect")} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="LOW">{t("priorities.low")}</SelectItem>
                <SelectItem value="MEDIUM">{t("priorities.medium")}</SelectItem>
                <SelectItem value="HIGH">{t("priorities.high")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">
              {t("categoryLabel")}
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full h-10 rounded-lg border border-gray-200 text-[13px] text-gray-700 focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20">
                <SelectValue placeholder={t("categorySelect")} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="General Inquiry">{t("categories.general")}</SelectItem>
                <SelectItem value="Technical Issue">{t("categories.technical")}</SelectItem>
                <SelectItem value="Billing">{t("categories.billing")}</SelectItem>
                <SelectItem value="Feature Request">{t("categories.feature")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#1a1a1a] block mb-1.5">
              {t("descLabel")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descPlaceholder")}
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-[#346853] focus:ring-1 focus:ring-[#346853]/20 transition-colors resize-none"
            />
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 pt-2 flex-row justify-end gap-3 border-t border-gray-100 mt-1">
          <button
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="text-[13px] font-semibold text-gray-500 hover:text-gray-700 transition-colors px-4 py-2"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-[#346853] hover:bg-[#2a5644] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
            {isSubmitting ? t("submitting") : t("submit")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
