import React from "react";
import { ArrowLeft, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

interface StepPreviewProps {
  onBack: () => void;
  parsedData: any[];
  headers: string[];
  isLoading: boolean;
  onImport: () => void;
  onCancel: () => void;
}

export const StepPreview: React.FC<StepPreviewProps> = ({
  onBack,
  parsedData,
  headers,
  isLoading,
  onImport,
  onCancel,
}) => {
  const t = useTranslations("RestaurantDashboard.Menu.Items.stepPreview");

  return (
    <div className="space-y-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-500 hover:text-gray-900 px-0 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("back")}
        </Button>
        <Typography variant="h4" className="font-bold text-gray-900">
          {t("previewTitle", { length: parsedData.length })}
        </Typography>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[50vh] scrollbar-thin scrollbar-thumb-gray-200">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="px-6 py-3 font-semibold whitespace-nowrap border-b bg-gray-50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {parsedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="bg-white hover:bg-emerald-50/30 transition-colors"
                >
                  {headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-gray-700"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 overflow-y-auto max-h-[55vh] pb-4">
        {parsedData.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-xl">
            <FileWarning className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <Typography className="text-gray-500">{t("noData")}</Typography>
          </div>
        ) : (
          parsedData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 shadow-sm space-y-2"
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-bg">
                  {t("row", { index: rowIndex + 1 })}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {headers.map((header, colIndex) => (
                  <div key={colIndex} className="flex flex-col">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                      {header}
                    </span>
                    <span className="text-sm text-gray-900 font-medium truncate">
                      {row[header] || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
        <Button variant="ghost" onClick={onCancel} className="text-gray-500">
          {t("cancel")}
        </Button>
        <Button
          className="bg-emerald-bg hover:bg-emerald-bg-hover text-white px-8"
          disabled={isLoading}
          onClick={onImport}
        >
          {isLoading ? t("importing") : t("importBtn")}
        </Button>
      </div>
    </div>
  );
};
