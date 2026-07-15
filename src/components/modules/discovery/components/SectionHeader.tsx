import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

import { SectionHeaderProps } from "@/components/modules/discovery/discovery.types";

const SectionHeader = ({
  title,
  actionText,
  onAction,
}: SectionHeaderProps) => {
  const t = useTranslations("Discovery.sectionHeader");
  const resolvedActionText = actionText ?? t("seeAll");
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {onAction && (
        <Button
          variant="link"
          className="text-[#346853] hover:text-[#2a5443] cursor-pointer hover:underline font-bold text-sm leading-none"
          onClick={onAction}
        >
          {resolvedActionText} <ChevronRight className="h-4 w-4 text-[#346853] rtl:rotate-180" />
        </Button>
      )}
    </div>
  );
};

export default SectionHeader;
