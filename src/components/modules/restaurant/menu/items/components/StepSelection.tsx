import React from "react";
import { Edit, FileSpreadsheet } from "lucide-react";
import { Typography } from "@/components/ui/typography";

interface StepSelectionProps {
  onManualEntry: () => void;
  onBulkImport: () => void;
}

export const StepSelection: React.FC<StepSelectionProps> = ({
  onManualEntry,
  onBulkImport,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
      <div
        onClick={onManualEntry}
        className="flex flex-col items-center justify-center p-8 border rounded-xl hover:border-emerald-bg hover:bg-emerald-50/30 cursor-pointer transition-all gap-4 group h-[250px]"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Edit className="w-8 h-8 text-emerald-bg" />
        </div>
        <div className="text-center space-y-2">
          <Typography variant="h4" className="font-bold text-gray-900">
            Manual Entry
          </Typography>
          <Typography variant="p" className="text-gray-500 text-sm">
            Fill out a form to add a single item with full details.
          </Typography>
        </div>
      </div>

      <div
        onClick={onBulkImport}
        className="flex flex-col items-center justify-center p-8 border rounded-xl hover:border-emerald-bg hover:bg-emerald-50/30 cursor-pointer transition-all gap-4 group h-[250px]"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
          <FileSpreadsheet className="w-8 h-8 text-emerald-bg" />
        </div>
        <div className="text-center space-y-2">
          <Typography variant="h4" className="font-bold text-gray-900">
            Bulk Import
          </Typography>
          <Typography variant="p" className="text-gray-500 text-sm">
            Upload a CSV file to add multiple items at once.
          </Typography>
        </div>
      </div>
    </div>
  );
};
