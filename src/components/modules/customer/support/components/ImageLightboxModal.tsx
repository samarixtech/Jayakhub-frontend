"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageLightboxModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export function ImageLightboxModal({ imageUrl, onClose }: ImageLightboxModalProps) {
  const t = useTranslations("CustomerDashboard.Support");
  if (!imageUrl) return null;

  return (
    <Dialog open={!!imageUrl} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-2 bg-black/90 border-none rounded-3xl overflow-hidden backdrop-blur-md">
        <DialogTitle className="sr-only">{t("attachmentPreviewSr")}</DialogTitle>
        <div className="relative flex flex-col items-center justify-center min-h-[300px] max-h-[85vh] p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
              title={t("downloadImageTooltip")}
            >
              <Download className="w-5 h-5" />
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full bg-white/20 text-white hover:bg-white/40 h-9 w-9"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <img
            src={imageUrl}
            alt={t("attachmentAlt")}
            className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
