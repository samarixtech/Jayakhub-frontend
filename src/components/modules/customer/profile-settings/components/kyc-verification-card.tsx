"use client";

import { Info, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKycVerification } from "./kyc/useKycVerification";
import { KYC_DOCUMENTS } from "./kyc/kyc-constants";
import { DocumentItem } from "./kyc/kyc-document-item";
import { useTranslations } from "next-intl";

export default function IdentityVerificationCard() {
  const {
    fileInputRef,
    kycData,
    activeTypeId,
    selectedFile,
    fetching,
    isUploading,
    handleSelectClick,
    handleFileChange,
    handleFinalUpload,
    resetSelection,
  } = useKycVerification();
  const t = useTranslations('CustomerDashboard.ProfileSettings');

  const hasActiveKyc = kycData.some(
    (d) => d.status === "verified" || d.status === "pending"
  );

  const documentsToShow = hasActiveKyc
    ? KYC_DOCUMENTS.filter((item) =>
        kycData.some(
          (d) =>
            d.documentType === item.id &&
            (d.status === "verified" || d.status === "pending")
        )
      )
    : KYC_DOCUMENTS;

  return (
    <Card className="rounded-3xl p-4 md:p-4 border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="px-0 pt-0 pb-6">
        <CardTitle className="text-lg font-bold text-gray-900">
          {t('identity_verification_title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-3">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf"
          onChange={handleFileChange}
        />

        {fetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-300" />
          </div>
        ) : (
          documentsToShow.map((item) => (
            <DocumentItem
              key={item.id}
              item={item}
              kycData={kycData}
              activeTypeId={activeTypeId}
              selectedFile={selectedFile}
              isUploading={isUploading}
              fetching={fetching}
              onSelectClick={handleSelectClick}
              onResetSelection={resetSelection}
              onFinalUpload={handleFinalUpload}
            />
          ))
        )}

        <p className="flex items-start sm:items-center gap-2 text-[11px] text-gray-400 font-medium pt-3 leading-relaxed">
          <Info size={14} className="text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
          {t('complete_verification')}
        </p>
      </CardContent>
    </Card>
  );
}
