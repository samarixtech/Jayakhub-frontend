import React from "react";
import { Typography } from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Eye } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ItemLivePreviewProps {
  formData: any;
  imagePreview: string | null;
}

export const ItemLivePreview: React.FC<ItemLivePreviewProps> = ({
  formData,
  imagePreview,
}) => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.livePreview");

  return (
    <div className="sticky top-10 space-y-6">
      {/* PREVIEW HEADER */}
      <div className="flex items-center gap-2 px-1">
        <Eye className="w-5 h-5 text-gray-400" />
        <Typography className="font-bold text-gray-400 uppercase tracking-widest text-xs">
          {t("title")}
        </Typography>
        <div className="ml-auto w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
      </div>

      <Card className="overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] bg-white rounded-2xl">
        {/* IMAGE PREVIEW */}
        <div className="relative aspect-video scale-95 m-2 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-50">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <div className="p-4 rounded-2xl bg-white border border-gray-50 shadow-sm">
                <ImageIcon className="w-8 h-8" />
              </div>
              <Typography className="text-[10px] uppercase font-black tracking-widest opacity-50">
                {t("noImage")}
              </Typography>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 pt-2 space-y-4">
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg"
          >
            {formData.category || t("defaultCategory")}
          </Badge>

          <div className="space-y-2">
            <Typography className="font-bold text-2xl text-gray-900 leading-tight">
              {formData.name || t("defaultName")}
            </Typography>
            <Typography className="text-3xl font-bold text-[#2D5A43]">
              ${formData.basePrice || "0.00"}
            </Typography>
          </div>
        </div>
      </Card>

      {/* PRO TIP */}
      <div className="p-6 bg-emerald-50/30 rounded-[24px] border border-emerald-100/30">
        <Typography className="text-xs text-emerald-800 leading-relaxed font-bold">
          {t("proTip")}
        </Typography>
      </div>
    </div>
  );
};
