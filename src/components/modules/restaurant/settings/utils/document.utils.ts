import { CreditCard, FileText, FileCheck, LucideIcon } from "lucide-react";

// DOCUMENT TYPE KEYS
export const getDocLabel = (type: string): string => {
  const labels: Record<string, string> = {
    government_id: "National ID Card",
    food_license: "Food Hygiene License",
    driving_license: "Driving License",
    passport: "Passport",
    tax_certificate: "Tax Certificate",
  };
  return (
    labels[type] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
};

// DOCUMENT CATEGORY
export const getDocCategory = (type: string): string => {
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

// DOCUMENT ICON
export const getDocIcon = (type: string): LucideIcon => {
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

// DOCUMENT STATUS
export const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
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
