import React from "react";
import { Shapes, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

interface CategoryCardProps {
  category: any;
  isEditing: boolean;
  editValue: string;
  onEditChange: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDelete: () => void;
  isUpdating: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isEditing,
  editValue,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  isUpdating,
}) => {
  const t = useTranslations("RestaurantDashboard.Menu.Categories.card");

  return (
    <Card className="px-3 pt-4 pb-2 flex items-center justify-between border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <Input
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            className="h-9"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
          />
          <Button
            size="icon"
            className="h-9 w-9 bg-[#1F4D36] shrink-0"
            onClick={onSaveEdit}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 shrink-0"
            onClick={onCancelEdit}
            disabled={isUpdating}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col w-full gap-0.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E2F1E8] rounded-lg flex items-center justify-center text-[#1F4D36] shrink-0">
              <Shapes className="w-5 h-5" />
            </div>
            <Typography className="font-bold text-gray-900 leading-tight truncate">
              {category.categoryName || category.name}
            </Typography>
          </div>
          <div className="flex items-center justify-end gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={onStartEdit}
              className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              disabled={isUpdating}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              disabled={isUpdating}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
