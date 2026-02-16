import React from "react";
import { CreditCard, FileText, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SettingsData } from "../types";

export function DocumentsTab({ settings }: { settings: SettingsData | null }) {
  const kyc = settings?.kyc || [];

  const getDocLabel = (type: string) => {
    switch (type) {
      case "government_id":
        return "National ID Card";
      case "food_license":
        return "Food Hygiene License";
      case "tax_certificate":
        return "Tax Certificate";
      default:
        return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  const getDocCategory = (type: string) => {
    switch (type) {
      case "government_id":
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
        return CreditCard;
      case "food_license":
        return FileText;
      default:
        return FileCheck;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
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
          View your verified business documents.
        </p>
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
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold tracking-wide px-3 py-1 rounded-full ${statusBadge.className}`}
                >
                  {statusBadge.label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
