import React from "react";
import { Sliders, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface VariantGroupCardProps {
  group: any;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const VariantGroupCard: React.FC<VariantGroupCardProps> = ({
  group,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  return (
    <Card className="p-0 border-none shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
      <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-[#1F4D36]">
            <Sliders className="w-5 h-5 rotate-90" />
          </div>
          <div>
            <Typography
              variant="h4"
              className="text-sm font-bold text-gray-900 leading-none mb-1"
            >
              {group.name}
            </Typography>
            <Typography className="text-xs text-gray-400 font-medium">
              {group.options.length} options
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-gray-400 hover:text-gray-900"
            disabled={isDeleting}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 bg-white flex flex-wrap gap-4">
        {group.options.map((opt: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center bg-gray-50 rounded-md px-3 py-2 text-sm font-medium text-gray-600 border border-gray-100"
          >
            <span className="mr-2">{opt.name}</span>
            <span className="font-bold text-[#1F4D36]">{opt.price}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
