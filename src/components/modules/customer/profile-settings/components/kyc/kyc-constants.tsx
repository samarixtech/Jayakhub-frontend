import type React from "react";
import { IdCard, Car, Smartphone } from "lucide-react";

export interface KycDocument {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export function getKycDocuments(t: any): KycDocument[] {
  return [
    {
      id: "government_id",
      title: t("kyc_gov_id_title"),
      desc: t("kyc_gov_id_desc"),
      icon: <IdCard className="text-blue-500" />,
    },
    {
      id: "driving_license",
      title: t("kyc_license_title"),
      desc: t("kyc_license_desc"),
      icon: <Car className="text-blue-500" />,
    },
    {
      id: "passport",
      title: t("kyc_passport_title"),
      desc: t("kyc_passport_desc"),
      icon: <Smartphone className="text-blue-500" />,
    },
  ];
}
