"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";
import { useStepKyc } from "../../hooks/useStepKyc";
import { DocumentUploadArea } from "../../components/DocumentUploadArea";

export default function StepKycView() {
  const {
    kycType,
    setKycType,
    docType,
    setDocType,
    kycFile,
    docFile,
    handleKycFileChange,
    handleDocFileChange,
    removeKycFile,
    removeDocFile,
    handleComplete,
    KYC_TYPES,
    DOC_TYPES,
  } = useStepKyc();
  const t = useTranslations("Onboarding.kycView");

  const activeKyc = KYC_TYPES.find((t) => t.id === kycType)!;
  const activeDoc = DOC_TYPES.find((t) => t.id === docType)!;

  const TabButton = ({ type, activeId, setActive, label }: any) => (
    <button
      type="button"
      onClick={() => setActive(type.id)}
      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
        activeId === type.id
          ? "bg-white text-emerald-bg shadow-sm"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-gray-900">
          {t("title")}
        </Typography>
        <Typography className="text-gray-500 mt-1">
          {t("subtitle")}
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Identity Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-bg text-white flex items-center justify-center text-[10px] font-bold">
                1
              </div>
              <Typography className="font-bold text-gray-900">
                {t("ownerIdentity")}
              </Typography>
            </div>
          </div>

          <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
            {KYC_TYPES.map((t) => (
              <TabButton
                key={t.id}
                type={t}
                activeId={kycType}
                setActive={setKycType}
                label={t.label}
              />
            ))}
          </div>

          <div className="flex-1">
            <DocumentUploadArea
              title="Owner Identity"
              description={activeKyc.description}
              sub={activeKyc.sub}
              file={kycFile}
              onFileChange={handleKycFileChange}
              onRemove={removeKycFile}
              themeColor="blue"
            />
          </div>
        </div>

        {/* Business Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-bg text-white flex items-center justify-center text-[10px] font-bold">
                2
              </div>
              <Typography className="font-bold text-gray-900">
                {t("restaurantDocuments")}
              </Typography>
            </div>
            <span className="text-[10px] font-bold text-emerald-bg px-2 py-0.5 bg-emerald-50 rounded-full uppercase">
              {t("selectOne")}
            </span>
          </div>

          <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
            {DOC_TYPES.map((t) => (
              <TabButton
                key={t.id}
                type={t}
                activeId={docType}
                setActive={setDocType}
                label={t.label}
              />
            ))}
          </div>

          <div className="flex-1">
            <DocumentUploadArea
              title="Restaurant Documents"
              description={activeDoc.description}
              sub={activeDoc.sub}
              file={docFile}
              onFileChange={handleDocFileChange}
              onRemove={removeDocFile}
              themeColor="emerald"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-8 border-t">
        <Button
          onClick={handleComplete}
          disabled={!kycFile || !docFile}
          className="bg-emerald-bg text-white px-10 h-12 rounded-2xl font-bold hover:bg-emerald-bg-hover"
        >
          {t("nextStep")}
        </Button>
      </div>
    </div>
  );
}
