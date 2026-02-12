import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
}

const SectionHeader = ({
  title,
  actionText = "See all",
  onAction,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <Button
        variant="ghost"
        className="text-[#346853] hover:text-[#2a5443] hover:bg-emerald-50 font-bold text-sm h-8 px-2"
        onClick={onAction}
      >
        {actionText} <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default SectionHeader;
