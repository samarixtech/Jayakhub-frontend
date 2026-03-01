"use client";
import { useRef, useState, useEffect } from "react";
import {
  IdCard,
  Car,
  Smartphone,
  Upload,
  Info,
  Loader2,
  CheckCircle2,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  uploadKycAction,
  getKycStatus,
} from "@/app/actions/customer/userprofile";
import { useServerAction } from "@/hooks/use-server-action";

interface KycRecord {
  documentType: string;
  status: "pending" | "verified" | "rejected";
  documentFile: string;
}

export default function IdentityVerificationCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [kycData, setKycData] = useState<KycRecord[]>([]);
  const [activeTypeId, setActiveTypeId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { execute: fetchStatus, isPending: fetching } = useServerAction(getKycStatus, {
     onSuccess: (data: any) => setKycData(data)
  });

  const { execute: uploadFile, isPending: isUploading } = useServerAction(uploadKycAction, {
      onSuccess: () => {
          resetSelection();
          fetchStatus();
      }
  });

  useEffect(() => {
    fetchStatus();
  }, []);

  const documents = [
    {
      id: "government_id",
      title: "Government ID",
      desc: "National ID Card",
      icon: <IdCard className="text-blue-500" />,
    },
    {
      id: "driving_license",
      title: "Driving License",
      desc: "Valid Driver's License",
      icon: <Car className="text-blue-500" />,
    },
    {
      id: "passport",
      title: "Passport",
      desc: "International Passport",
      icon: <Smartphone className="text-blue-500" />,
    },
  ];

  const handleSelectClick = (typeId: string) => {
    setActiveTypeId(typeId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setActiveTypeId(null);
    }
  };

  const handleFinalUpload = async () => {
    if (!selectedFile || !activeTypeId) return;
    const formData = new FormData();
    formData.append("documentType", activeTypeId);
    formData.append("documentFile", selectedFile);
    uploadFile(formData);
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setActiveTypeId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const renderActionArea = (item: (typeof documents)[0]) => {
    const existingDoc = kycData.find((d) => d.documentType === item.id);
    const isSelected = activeTypeId === item.id && selectedFile;

    if (existingDoc) {
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${statusStyles[existingDoc.status]}`}
        >
          {statusIcons[existingDoc.status]}
          {existingDoc.status}
        </div>
      );
    }

    if (isSelected) {
      return (
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={resetSelection}
            disabled={isUploading}
            className="text-gray-400 hover:text-red-500 px-2"
          >
            <X size={16} />
          </Button>
          <Button
            onClick={handleFinalUpload}
            disabled={isUploading}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold rounded-xl px-4 h-9 whitespace-nowrap"
          >
            {isUploading && <Loader2 className="animate-spin mr-2" size={14} />}
            {isUploading ? "Uploading..." : "Confirm"}
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="ghost"
        onClick={() => handleSelectClick(item.id)}
        disabled={!!activeTypeId || fetching}
        className="text-gray-600 text-xs font-bold flex gap-2 border border-gray-100 rounded-xl px-4 py-2 h-auto hover:bg-gray-50 whitespace-nowrap"
      >
        <Upload size={14} /> Select
      </Button>
    );
  };

  return (
    /* Responsive adjustment: Reduced padding on mobile (p-5) vs desktop (p-8) */
    <Card className="rounded-3xl p-5 md:p-8 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="text-lg font-bold text-gray-900">
          Identity Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />

        {fetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-300" />
          </div>
        ) : (
          documents.map((item) => {
            const isSelected = activeTypeId === item.id && selectedFile;
            return (
              <div
                key={item.id}
                /* Responsive adjustment: 
                   - flex-col on tiny screens, flex-row on sm+
                   - items-start on tiny screens, items-center on sm+
                */
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border rounded-2xl transition-all px-4 sm:px-5 ${
                  isSelected ? "border-blue-200 bg-blue-50/30" : "border-gray-50 bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">
                    {item.icon}
                  </div>
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
                {/* Responsive adjustment: 
                   - On mobile, action area takes full width to align buttons properly 
                */}
                <div className="w-full sm:w-auto flex justify-end">
                  {renderActionArea(item)}
                </div>
              </div>
            );
          })
        )}

        <p className="flex items-start sm:items-center gap-2 text-[11px] text-gray-400 font-medium pt-3 leading-relaxed">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5 sm:mt-0" /> 
          Complete verification with at least one document to unlock full features.
        </p>
      </CardContent>
    </Card>
  );
}