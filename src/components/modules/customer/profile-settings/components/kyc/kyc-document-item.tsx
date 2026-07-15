import {
  CheckCircle2,
  X,
  Loader2,
  Upload,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { KycRecord } from "./useKycVerification";
import { KycDocument } from "./kyc-constants";
import { useTranslations } from "next-intl";

interface DocumentItemProps {
  item: KycDocument;
  kycData: KycRecord[];
  activeTypeId: string | null;
  selectedFile: File | null;
  isUploading: boolean;
  fetching: boolean;
  onSelectClick: (id: string) => void;
  onResetSelection: () => void;
  onFinalUpload: () => void;
}

export function DocumentItem({
  item,
  kycData,
  activeTypeId,
  selectedFile,
  isUploading,
  fetching,
  onSelectClick,
  onResetSelection,
  onFinalUpload,
}: DocumentItemProps) {
  const isSelected = activeTypeId === item.id && selectedFile !== null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border rounded-2xl transition-all px-4 sm:px-5 ${isSelected ? "border-blue-200 bg-blue-50/30" : "border-gray-50 bg-white"
        }`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">{item.icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {item.title}
          </p>
          <p className="text-xs text-gray-400 font-medium truncate">
            {isSelected ? (
              <span className="text-blue-600 flex items-center gap-1">
                <CheckCircle2 size={12} className="shrink-0" />{" "}
                <span className="truncate">{selectedFile?.name}</span>
              </span>
            ) : (
              item.desc
            )}
          </p>
        </div>
      </div>
      <div className="w-full sm:w-auto flex justify-end">
        <DocumentActionArea
          item={item}
          kycData={kycData}
          isSelected={isSelected}
          selectedFile={selectedFile}
          activeTypeId={activeTypeId}
          isUploading={isUploading}
          fetching={fetching}
          onSelectClick={onSelectClick}
          onResetSelection={onResetSelection}
          onFinalUpload={onFinalUpload}
        />
      </div>
    </div>
  );
}

interface DocumentActionAreaProps {
  item: KycDocument;
  kycData: KycRecord[];
  isSelected: boolean;
  selectedFile: File | null;
  activeTypeId: string | null;
  isUploading: boolean;
  fetching: boolean;
  onSelectClick: (id: string) => void;
  onResetSelection: () => void;
  onFinalUpload: () => void;
}

function DocumentActionArea({
  item,
  kycData,
  isSelected,
  selectedFile,
  activeTypeId,
  isUploading,
  fetching,
  onSelectClick,
  onResetSelection,
  onFinalUpload,
}: DocumentActionAreaProps) {
  const t = useTranslations('CustomerDashboard.ProfileSettings');
  const existingDoc = kycData.find((d) => d.documentType === item.id);
  const isRejected = existingDoc?.status === "rejected";

  if (existingDoc && !isRejected) {
    return <DocumentStatusBadge status={existingDoc.status} />;
  }

  if (isSelected) {
    return (
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={onResetSelection}
          disabled={isUploading}
          className="text-gray-400 hover:text-red-500 px-2"
        >
          <X size={16} />
        </Button>
        <Button
          onClick={onFinalUpload}
          disabled={isUploading}
          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold rounded-xl px-4 h-9 whitespace-nowrap"
        >
          {isUploading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            t("confirm")
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
      {isRejected && <DocumentStatusBadge status="rejected" />}
      <Button
        variant="ghost"
        onClick={() => onSelectClick(item.id)}
        disabled={!!selectedFile || fetching}
        className="text-gray-600 text-xs font-bold flex gap-2 border border-gray-100 rounded-xl px-4 py-2 h-auto hover:bg-gray-50 whitespace-nowrap"
      >
        <Upload size={14} /> {t('select')}
      </Button>
    </div>
  );
}

function DocumentStatusBadge({ status }: { status: KycRecord["status"] }) {
  const statusStyles = {
    verified: "bg-green-50 text-green-700 border-green-100",
    pending: "bg-amber-50 text-amber-700 border-amber-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
  };

  const statusIcons = {
    verified: <CheckCircle2 size={14} />,
    pending: <Clock size={14} />,
    rejected: <AlertCircle size={14} />,
  };

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${statusStyles[status]}`}
    >
      {statusIcons[status]}
      {status}
    </div>
  );
}
