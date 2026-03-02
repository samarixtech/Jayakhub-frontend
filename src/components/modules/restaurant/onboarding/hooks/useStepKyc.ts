"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "../OnboardingContext";

export const KYC_TYPES = [
  {
    id: "id_card",
    label: "ID Card",
    description: "Upload your ID Card",
    sub: "Please upload a clear photo of the front and back of your Government ID.",
  },
  {
    id: "passport",
    label: "Passport",
    description: "Upload your Passport",
    sub: "Please upload the data page of your valid Passport.",
  },
  {
    id: "driving_license",
    label: "Driving License",
    description: "Upload your Driving License",
    sub: "Please upload a clear photo of your valid Driving License.",
  },
];

export const DOC_TYPES = [
  {
    id: "food_license",
    label: "Food License",
    description: "Upload Food License",
    sub: "Upload your valid food operating license or health permit.",
  },
  {
    id: "tax_certificate",
    label: "Tax Certificate",
    description: "Upload Tax Certificate",
    sub: "Upload your valid business tax registration certificate.",
  },
];

export const useStepKyc = () => {
  const router = useRouter();
  const { country, language } = useLocale();
  const { kycFile, setKycFile, docFile, setDocFile } = useOnboarding();

  const [kycType, setKycType] = useState("id_card");
  const [docType, setDocType] = useState("food_license");
  const [savedKycName, setSavedKycName] = useState<string | null>(null);
  const [savedDocName, setSavedDocName] = useState<string | null>(null);

  useEffect(() => {
    const savedKyc = localStorage.getItem("onboarding_kyc_name");
    const savedDoc = localStorage.getItem("onboarding_doc_name");
    const savedKycType = localStorage.getItem("onboarding_kyc_type");
    const savedDocType = localStorage.getItem("onboarding_doc_type");

    if (savedKyc) setSavedKycName(savedKyc);
    if (savedDoc) setSavedDocName(savedDoc);
    if (savedKycType) setKycType(savedKycType);
    if (savedDocType) setDocType(savedDocType);
  }, []);

  const handleKycFileChange = (file: File) => {
    setKycFile(file);
    setSavedKycName(file.name);
    localStorage.setItem("onboarding_kyc_name", file.name);
    toast.success("Identity document attached");
  };

  const handleDocFileChange = (file: File) => {
    setDocFile(file);
    setSavedDocName(file.name);
    localStorage.setItem("onboarding_doc_name", file.name);
    toast.success("Business document attached");
  };

  const removeKycFile = () => {
    setKycFile(null);
    setSavedKycName(null);
    localStorage.removeItem("onboarding_kyc_name");
  };

  const removeDocFile = () => {
    setDocFile(null);
    setSavedDocName(null);
    localStorage.removeItem("onboarding_doc_name");
  };

  const handleComplete = () => {
    const hasKyc = kycFile || savedKycName;
    const hasDoc = docFile || savedDocName;

    if (!hasKyc || !hasDoc) {
      toast.error("Please upload both identity and business documents.");
      return;
    }

    localStorage.setItem("onboarding_kyc_completed", "true");
    localStorage.setItem("onboarding_kyc_type", kycType);
    localStorage.setItem("onboarding_doc_type", docType);

    toast.success("Verification documents submitted");
    router.push(`/restaurant/onboarding/step-bank-details`);
  };

  return {
    kycType,
    setKycType,
    docType,
    setDocType,
    kycFile:
      kycFile || savedKycName
        ? { name: kycFile?.name || savedKycName || "" }
        : null,
    docFile:
      docFile || savedDocName
        ? { name: docFile?.name || savedDocName || "" }
        : null,
    handleKycFileChange,
    handleDocFileChange,
    removeKycFile,
    removeDocFile,
    handleComplete,
    KYC_TYPES,
    DOC_TYPES,
  };
};
