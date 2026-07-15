import { CreditCard, FileText, FileCheck, LucideIcon } from "lucide-react";

type Translator = (key: string) => string;

// DOCUMENT TYPE KEYS
export const getDocLabel = (type: string, t: Translator): string => {
  const knownTypes = [
    "government_id",
    "food_license",
    "driving_license",
    "passport",
    "tax_certificate",
  ];
  if (knownTypes.includes(type)) {
    return t(`docLabels.${type}`);
  }
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

// DOCUMENT CATEGORY
export const getDocCategory = (type: string, t: Translator): string => {
  switch (type) {
    case "government_id":
    case "driving_license":
    case "passport":
      return t("docCategories.identityProof");
    case "food_license":
      return t("docCategories.restaurantDocument");
    case "tax_certificate":
      return t("docCategories.financialDocument");
    default:
      return t("docCategories.document");
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
export const getStatusBadge = (status: string, t: Translator) => {
  switch (status.toLowerCase()) {
    case "verified":
    case "approved":
      return {
        label: t("statusBadges.verified"),
        className: "bg-emerald-50 text-emerald-600 border-emerald-200",
      };
    case "rejected":
      return {
        label: t("statusBadges.rejected"),
        className: "bg-red-50 text-red-600 border-red-200",
      };
    case "pending":
    default:
      return {
        label: t("statusBadges.pending"),
        className: "bg-amber-50 text-amber-600 border-amber-200",
      };
  }
};
