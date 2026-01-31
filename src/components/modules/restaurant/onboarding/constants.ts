import {
  User,
  Store,
  Clock,
  Image,
  FileText,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export const STEPS = [
  { id: 1, label: "Owner Info", icon: User },
  { id: 2, label: "Restaurant", icon: Store },
  { id: 3, label: "Brand Assets", icon: Image },
  { id: 4, label: "Schedule", icon: Clock },
  { id: 5, label: "KYC", icon: FileText },
  { id: 6, label: "Bank Details", icon: CreditCard },
  { id: 7, label: "Review", icon: CheckCircle },
];
