"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Edit2, Trash2, MoreVertical, Clock, Tag, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DealCombo } from "../types/deals";
import { useCLC } from "@/context/CLCContext";

interface DealCardProps {
  deal: DealCombo;
  onEdit: (deal: DealCombo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function DealCard({
  deal,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: DealCardProps) {
  const { formatPrice } = useCLC();
  const t = useTranslations("RestaurantDashboard.Deals");

  const getStatusBadge = (status: DealCombo["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/90 text-white font-semibold text-[10px] uppercase">
            {t("status.active")}
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-500/90 text-white font-semibold text-[10px] uppercase">
            {t("status.scheduled")}
          </Badge>
        );
      case "inactive":
      case "expired":
        return (
          <Badge className="bg-gray-400/90 text-white font-semibold text-[10px] uppercase">
            {t("status.inactive")}
          </Badge>
        );
    }
  };

  const getTypeLabel = (type: DealCombo["dealType"]) => {
    switch (type) {
      case "flash":
        return t("dealTypes.flash");
      case "weekend":
        return t("dealTypes.weekend");
      case "seasonal":
        return t("dealTypes.seasonal");
      case "combo":
        return t("dealTypes.combo");
      case "special":
      case "spcial":
        return t("dealTypes.special");
      default:
        return t("dealTypes.special");
    }
  };

  return (
    <Card className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          <div className="absolute top-3 left-3 flex items-center gap-2">
            {getStatusBadge(deal.status)}
            {deal.badge && (
              <Badge className="bg-orange-500/90 text-white font-bold text-[10px] tracking-wider uppercase">
                {deal.badge}
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>
              {deal.discountType === "fixed"
                ? `SAVE ${formatPrice(deal.discountAmount)}`
                : `SAVE ${deal.discountPercentage}%`}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 text-white">
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              {getTypeLabel(deal.dealType)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Typography className="text-base font-bold text-gray-900 group-hover:text-navy transition-colors">
                {deal.title}
              </Typography>
              <Typography className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                {deal.tagline}
              </Typography>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl bg-white"
              >
                {onViewDetails && (
                  <DropdownMenuItem
                    onClick={() => onViewDetails(deal.id)}
                    className="cursor-pointer gap-2"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span>{t("card.viewDetails")}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onEdit(deal)}
                  className="cursor-pointer gap-2"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                  <span>{t("card.editDeal")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(deal.id)}
                  className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t("card.delete")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {deal.items.map((item, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-gray-50 border border-gray-200/80 text-gray-700 px-2 py-0.5 rounded-lg flex items-center gap-1"
              >
                <span className="font-bold text-orange-600">
                  {item.quantity}x
                </span>
                <span className="truncate max-w-[120px]">{item.name}</span>
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <div>
              <Typography className="text-[10px] text-gray-400 uppercase font-semibold">
                {t("card.comboPrice")}
              </Typography>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-navy font-mono">
                  {formatPrice(deal.comboPrice)}
                </span>
                <span className="text-xs text-gray-400 line-through font-mono">
                  {formatPrice(deal.originalPrice)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 inline-block">
                {t("card.saveAmount", { amount: formatPrice(deal.discountAmount) })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="truncate max-w-[140px] text-[11px]">
            {deal.schedule}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-gray-500">
            {deal.status === "active" ? t("status.active") : t("common.off")}
          </span>
          <Switch
            checked={deal.status === "active"}
            onCheckedChange={() => onToggleStatus(deal.id)}
            className="data-[state=checked]:bg-emerald-500"
          />
        </div>
      </div>
    </Card>
  );
}
