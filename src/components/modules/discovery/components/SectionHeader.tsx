import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SectionHeaderProps } from "@/components/modules/discovery/discovery.types";

const SectionHeader = ({
  title,
  actionText = "See All",
  onAction,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {onAction && (
        <Button
          variant="link"
          className="text-[#346853] hover:text-[#2a5443] cursor-pointer hover:underline font-bold text-sm leading-none"
          onClick={onAction}
        >
          {actionText} <ChevronRight className="h-4 w-4 text-[#346853]" />
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
