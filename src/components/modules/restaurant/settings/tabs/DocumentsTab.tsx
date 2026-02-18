"use client";
import React, { useState } from "react";
import {
  CreditCard,
  FileText,
  FileCheck,
  InfoIcon,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SettingsData } from "../types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateKycAction } from "@/app/actions/restaurant/settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function DocumentsTab({ settings }: { settings: SettingsData | null }) {
  const router = useRouter();
  const kyc = settings?.kyc || [];
  const updateStatus = settings?.onboardingUpdate?.kyc || "none";
  const isPending = updateStatus === "pending";
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState("government_id");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("documentType", docType);
    formData.append("documentFile", file);

    try {
      const response = await updateKycAction(formData);
      if (response.success) {
        toast.success(response.message || "Document uploaded successfully.");
        setFile(null);
        // We might want to reset the file input visually, but simple state reset works for logic
        router.refresh();
      } else {
        toast.error(response.message || "Failed to upload document.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getDocLabel = (type: string) => {
    switch (type) {
      case "government_id":
        return "National ID Card";
      case "food_license":
        return "Food Hygiene License";
      case "driving_license":
        return "Driving License";
      case "passport":
        return "Passport";
      case "tax_certificate":
        return "Tax Certificate";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getDocCategory = (type: string) => {
    switch (type) {
      case "government_id":
      case "driving_license":
      case "passport":
        return "Identity Proof";
      case "food_license":
        return "Restaurant Document";
      case "tax_certificate":
        return "Financial Document";
      default:
        return "Document";
    }
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case "government_id":
      case "driving_license":
      case "passport":
        return CreditCard;
      case "food_license":
        return FileText;
      default:
        return FileCheck;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return {
          label: "VERIFIED",
          className: "bg-emerald-50 text-emerald-600 border-emerald-200",
        };
      case "rejected":
        return {
          label: "REJECTED",
          className: "bg-red-50 text-red-600 border-red-200",
        };
      case "pending":
      default:
        return {
          label: "PENDING",
          className: "bg-amber-50 text-amber-600 border-amber-200",
        };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Documents & Verification
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          View and manage your business verification documents.
        </p>
      </div>

      {isPending && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800 font-semibold">
            Verification Pending
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            YOUR CHANGES ARE SUBMITTED, WE ARE REVIEWING IT AND WILL APPROVE
            SHORTLY.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Section */}
      <div
        className={`mb-8 p-5 border border-dashed border-gray-200 rounded-xl bg-gray-50/50 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
      >
        <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <UploadCloud className="w-4 h-4" /> Upload New Document
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600">
              Document Type
            </Label>
            <Select
              disabled={isPending}
              value={docType}
              onValueChange={setDocType}
            >
              <SelectTrigger className="bg-white border-gray-200">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="government_id">Government ID</SelectItem>
                <SelectItem value="driving_license">Driving License</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
                <SelectItem value="food_license">Food License</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600">
              Select File
            </Label>
            <Input
              type="file"
              className="bg-white border-gray-200 cursor-pointer file:text-primary file:font-semibold"
              onChange={handleFileChange}
              disabled={isPending}
              accept="image/*,.pdf"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={loading || isPending || !file}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Documents on File
      </h3>

      {kyc.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileCheck className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No documents uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {kyc.map((doc) => {
            const DocIcon = getDocIcon(doc.documentType);
            const statusBadge = getStatusBadge(doc.status);
            const verifiedDate = doc.updatedAt
              ? `Verified on ${formatDate(doc.updatedAt)}`
              : "";

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1F4D36] rounded-full flex items-center justify-center">
                    <DocIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {getDocLabel(doc.documentType)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {getDocCategory(doc.documentType)}
                      {verifiedDate && ` • ${verifiedDate}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-primary hover:bg-primary/10"
                    onClick={() => {
                      const baseUrl =
                        process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";
                      const url = doc.documentFile.startsWith("http")
                        ? doc.documentFile
                        : `${baseUrl}${doc.documentFile}`;
                      window.open(url, "_blank");
                    }}
                  >
                    <div className="w-4 h-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  </Button>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold tracking-wide px-3 py-1 rounded-full ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
