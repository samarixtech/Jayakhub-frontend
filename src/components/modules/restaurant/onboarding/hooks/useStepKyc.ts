"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "../OnboardingContext";

export const useStepKyc = () => {
  const router = useRouter();
  const { country, language } = useLocale();
  const { setKycFile, setDocFile } = useOnboarding();
  const t = useTranslations("Onboarding.kycView");

  const KYC_TYPES = useMemo(
    () => [
      {
        id: "id_card",
        label: t("types.idCard.label"),
        description: t("types.idCard.description"),
        sub: t("types.idCard.sub"),
      },
      {
        id: "passport",
        label: t("types.passport.label"),
        description: t("types.passport.description"),
        sub: t("types.passport.sub"),
      },
      {
        id: "driving_license",
        label: t("types.drivingLicense.label"),
        description: t("types.drivingLicense.description"),
        sub: t("types.drivingLicense.sub"),
      },
    ],
    [t],
  );

  const DOC_TYPES = useMemo(
    () => [
      {
        id: "food_license",
        label: t("docs.foodLicense.label"),
        description: t("docs.foodLicense.description"),
        sub: t("docs.foodLicense.sub"),
      },
      {
        id: "tax_certificate",
        label: t("docs.taxCertificate.label"),
        description: t("docs.taxCertificate.description"),
        sub: t("docs.taxCertificate.sub"),
      },
    ],
    [t],
  );

  const [kycType, setKycTypeState] = useState("id_card");
  const [docType, setDocTypeState] = useState("food_license");

  // Isolated file per KYC type — switching tabs never cross-contaminates
  const [kycFiles, setKycFiles] = useState<Record<string, File | null>>({});
  const [savedKycInfo, setSavedKycInfo] = useState<{
    name: string;
    type: string;
  } | null>(null);

  // Isolated file per doc type — same pattern as KYC
  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({});
  const [savedDocInfo, setSavedDocInfo] = useState<{
    name: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    const savedKycName = localStorage.getItem("onboarding_kyc_name");
    const savedKycType = localStorage.getItem("onboarding_kyc_type");
    const savedDocName = localStorage.getItem("onboarding_doc_name");
    const savedDocType = localStorage.getItem("onboarding_doc_type");

    if (savedKycName && savedKycType) {
      setSavedKycInfo({ name: savedKycName, type: savedKycType });
      setKycTypeState(savedKycType);
    }
    if (savedDocName && savedDocType) {
      setSavedDocInfo({ name: savedDocName, type: savedDocType });
      setDocTypeState(savedDocType);
    }
  }, []);

  // Switching KYC tabs syncs the context to the new tab's file (or null if empty)
  const setKycType = (newType: string) => {
    setKycTypeState(newType);
    setKycFile(kycFiles[newType] || null);
  };

  // Switching doc tabs syncs the context to the new tab's file (or null if empty)
  const setDocType = (newType: string) => {
    setDocTypeState(newType);
    setDocFile(docFiles[newType] || null);
  };

  const handleKycFileChange = (file: File) => {
    // Upload for the current type and discard any file from all other types
    setKycFiles({ [kycType]: file });
    setKycFile(file);
    setSavedKycInfo({ name: file.name, type: kycType });
    localStorage.setItem("onboarding_kyc_name", file.name);
    localStorage.setItem("onboarding_kyc_type", kycType);
    toast.success(t("identityAttached"));
  };

  const handleDocFileChange = (file: File) => {
    // Upload for the current doc type and discard any file from all other types
    setDocFiles({ [docType]: file });
    setDocFile(file);
    setSavedDocInfo({ name: file.name, type: docType });
    localStorage.setItem("onboarding_doc_name", file.name);
    localStorage.setItem("onboarding_doc_type", docType);
    toast.success(t("businessAttached"));
  };

  const removeKycFile = () => {
    setKycFiles((prev) => ({ ...prev, [kycType]: null }));
    setKycFile(null);
    setSavedKycInfo(null);
    localStorage.removeItem("onboarding_kyc_name");
    localStorage.removeItem("onboarding_kyc_type");
  };

  const removeDocFile = () => {
    setDocFiles((prev) => ({ ...prev, [docType]: null }));
    setDocFile(null);
    setSavedDocInfo(null);
    localStorage.removeItem("onboarding_doc_name");
    localStorage.removeItem("onboarding_doc_type");
  };

  const handleComplete = () => {
    const hasKyc = kycFiles[kycType] || savedKycInfo?.type === kycType;
    const hasDoc = docFiles[docType] || savedDocInfo?.type === docType;

    if (!hasKyc || !hasDoc) {
      toast.error(t("uploadBothRequired"));
      return;
    }

    localStorage.setItem("onboarding_kyc_completed", "true");
    localStorage.setItem("onboarding_kyc_type", kycType);
    localStorage.setItem("onboarding_doc_type", docType);

    toast.success(t("verificationSubmitted"));
    router.push(`/restaurant/onboarding/step-bank-details`);
  };

  // File shown in the upload area — only the current tab's file, never another tab's
  const currentKycFile =
    kycFiles[kycType] ??
    (savedKycInfo?.type === kycType ? { name: savedKycInfo.name } : null);

  const currentDocFile =
    docFiles[docType] ??
    (savedDocInfo?.type === docType ? { name: savedDocInfo.name } : null);

  return {
    kycType,
    setKycType,
    docType,
    setDocType,
    kycFile: currentKycFile,
    docFile: currentDocFile,
    handleKycFileChange,
    handleDocFileChange,
    removeKycFile,
    removeDocFile,
    handleComplete,
    KYC_TYPES,
    DOC_TYPES,
  };
};
