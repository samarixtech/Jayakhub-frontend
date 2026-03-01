import { IdCard, Car, Smartphone } from "lucide-react";

export const KYC_DOCUMENTS = [
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
