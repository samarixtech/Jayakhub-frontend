import {
  User,
  Store,
  Clock,
  Image,
  FileText,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export function getSteps(t: any) {
  return [
    { id: 1, label: t("steps.ownerInfo"), icon: User },
    { id: 2, label: t("steps.restaurant"), icon: Store },
    { id: 3, label: t("steps.brandAssets"), icon: Image },
    { id: 4, label: t("steps.schedule"), icon: Clock },
    { id: 5, label: t("steps.kyc"), icon: FileText },
    { id: 6, label: t("steps.bankDetails"), icon: CreditCard },
    { id: 7, label: t("steps.review"), icon: CheckCircle },
  ];
}
