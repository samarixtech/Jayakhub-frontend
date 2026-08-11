"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Edit2, Copy, Trash2, MoreVertical, Eye } from "lucide-react";
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
import GlobalTable, { Column } from "@/components/common/GlobalTable";
import { DealCombo } from "../types/deals";
import { useCLC } from "@/context/CLCContext";

interface DealsTableProps {
  deals: DealCombo[];
  onEdit: (deal: DealCombo) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function DealsTable({
  deals,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: DealsTableProps) {
  const { formatPrice } = useCLC();
  const t = useTranslations("RestaurantDashboard.Deals");

  const columns: Column<DealCombo>[] = [
    {
      header: t("table.columnDealCombo"),
      cell: (deal) => (
        <div className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative">
            <Image
              src={deal.image}
              alt={deal.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Typography className="font-bold text-gray-900 text-sm">
                {deal.title}
              </Typography>
              {deal.badge && (
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 font-bold text-[9px] px-1.5 py-0 shadow-none border-none">
                  {deal.badge}
                </Badge>
              )}
            </div>
            <Typography className="text-gray-400 text-xs line-clamp-1">
              {deal.tagline}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      header: t("table.columnIncludedItems"),
      cell: (deal) => (
        <div className="flex flex-wrap gap-1 max-w-[260px]">
          {deal.items.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md"
            >
              <strong className="text-orange-600 mr-0.5">
                {item.quantity}x
              </strong>
              {item.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: t("table.columnPricing"),
      cell: (deal) => (
        <div className="font-mono">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-navy text-sm">
              {formatPrice(deal.comboPrice)}
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(deal.originalPrice)}
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {t("table.saveWithPercent", {
              amount: formatPrice(deal.discountAmount),
              percent: deal.discountPercentage,
            })}
          </span>
        </div>
      ),
    },
    {
      header: t("table.columnSchedule"),
      cell: (deal) => (
        <span className="text-xs text-gray-600 font-medium">
          {deal.schedule}
        </span>
      ),
    },
    {
      header: t("table.columnStatus"),
      cell: (deal) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={deal.status === "active"}
            onCheckedChange={() => onToggleStatus(deal.id)}
            className="data-[state=checked]:bg-emerald-500"
          />
          <span className="text-xs font-semibold uppercase text-gray-600">
            {t(`status.${deal.status}`)}
          </span>
        </div>
      ),
    },
    {
      header: t("table.columnActions"),
      cell: (deal) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-xl bg-white">
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
              <span>{t("table.edit")}</span>
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
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
      <GlobalTable columns={columns} data={deals} />
    </div>
  );
}
