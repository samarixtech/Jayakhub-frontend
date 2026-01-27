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
import { toast } from "react-hot-toast";
import {
  uploadKycAction,
  getKycStatus,
} from "@/app/actions/customer/userprofile";

interface KycRecord {
  documentType: string;
  status: "pending" | "verified" | "rejected";
  documentFile: string;
}

export default function IdentityVerificationCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [kycData, setKycData] = useState<KycRecord[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeTypeId, setActiveTypeId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  // Fetch KYC status on mount
  const fetchStatus = async () => {
    setFetching(true);
    const result = await getKycStatus();
    if (result.success) {
      setKycData(result.data);
    }
    setFetching(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStatus();
  }, []);

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
    setIsUploading(true);
    const formData = new FormData();
    formData.append("documentType", activeTypeId);
    formData.append("documentFile", selectedFile);

    const result = await uploadKycAction(formData);
    if (result.success) {
      toast.success(result.message || "Document uploaded successfully");
      resetSelection();
      fetchStatus(); // Refresh the list
    } else {
      toast.error(result.message || "Upload failed");
      setIsUploading(false);
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setActiveTypeId(null);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper to render Status or Upload Button
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusStyles[existingDoc.status]}`}
        >
          {statusIcons[existingDoc.status]}
          {existingDoc.status}
        </div>
      );
    }

    if (isSelected) {
      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={resetSelection}
            disabled={isUploading}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={16} />
          </Button>
          <Button
            onClick={handleFinalUpload}
            disabled={isUploading}
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold rounded-xl px-4 h-9"
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
        className="text-gray-600 text-xs font-bold flex gap-2 border border-gray-100 rounded-xl px-4 py-2 h-auto hover:bg-gray-50"
      >
        <Upload size={14} /> Select
      </Button>
    );
  };

  return (
    <Card className="rounded-3xl p-8 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          Identity Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-2">
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
                className={`flex items-center justify-between py-4 border rounded-2xl transition-all px-5 ${isSelected ? "border-blue-200 bg-blue-50/30" : "border-gray-50 bg-white"}`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-2.5 rounded-xl">{item.icon}</div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {isSelected ? (
                        <span className="text-blue-600 flex items-center gap-1">
                          <CheckCircle2 size={12} />{" "}
                          {selectedFile.name.slice(0, 15)}...
                        </span>
                      ) : (
                        item.desc
                      )}
                    </p>
                  </div>
                </div>
                {renderActionArea(item)}
              </div>
            );
          })
        )}

        <p className="flex items-center gap-2 text-[11px] text-gray-400 font-medium pt-3">
          <Info size={14} className="text-blue-500" /> Complete verification
          with at least one document to unlock full features.
        </p>
      </CardContent>
    </Card>
  );
}
