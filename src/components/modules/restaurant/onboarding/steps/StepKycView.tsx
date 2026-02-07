"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Upload, FileText, CheckCircle, Info, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";

// Document Types Configuration
const KYC_TYPES = [
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

const DOC_TYPES = [
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

export default function StepKycView() {
  const router = useRouter();
  const { country, language } = useLocale();
  const { prevStep } = useOnboarding();

  // State
  const [kycType, setKycType] = useState("id_card");
  const [docType, setDocType] = useState("food_license");

  const [kycFile, setKycFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  // Persisted names for static mode
  const [savedKycName, setSavedKycName] = useState<string | null>(null);
  const [savedDocName, setSavedDocName] = useState<string | null>(null);

  const kycInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Load saved metadata
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

  // Handlers
  const handleKycFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setKycFile(file);
      setSavedKycName(file.name);
      localStorage.setItem("onboarding_kyc_name", file.name);
      toast.success("Identity document attached");
    }
  };

  const handleDocFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setDocFile(file);
      setSavedDocName(file.name);
      localStorage.setItem("onboarding_doc_name", file.name);
      toast.success("Business document attached");
    }
  };

  const removeKycFile = () => {
    setKycFile(null);
    setSavedKycName(null);
    localStorage.removeItem("onboarding_kyc_name");
    if (kycInputRef.current) kycInputRef.current.value = "";
  };

  const removeDocFile = () => {
    setDocFile(null);
    setSavedDocName(null);
    localStorage.removeItem("onboarding_doc_name");
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handleComplete = () => {
    const hasKyc = kycFile || savedKycName;
    const hasDoc = docFile || savedDocName;

    if (!hasKyc || !hasDoc) {
      toast.error("Please upload both identity and business documents.");
      return;
    }

    console.log("Static Mode: Submitting All Documents", {
      kyc: { type: kycType, file: kycFile?.name || savedKycName },
      doc: { type: docType, file: docFile?.name || savedDocName },
    });

    // Save metadata
    localStorage.setItem("onboarding_kyc_completed", "true");
    localStorage.setItem("onboarding_kyc_type", kycType);
    localStorage.setItem("onboarding_doc_type", docType);

    toast.success("Verification documents submitted");
    router.push(
      `/${country}/${language}/restaurant/onboarding/step-bank-details`,
    );
  };

  const activeKyc = KYC_TYPES.find((t) => t.id === kycType)!;
  const activeDoc = DOC_TYPES.find((t) => t.id === docType)!;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-[#111827]">
          Upload Documents
        </Typography>
        <Typography className="text-gray-500 mt-1">
          Verify your identity and business to start selling.
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* --- SECTION 1: OWNER IDENTITY --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#346853] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <Typography
                variant="h4"
                className="font-bold text-gray-900 text-base"
              >
                Owner Identity (KYC)
              </Typography>
            </div>
            <Typography className="text-xs text-gray-400 cursor-pointer underline">
              Why is this needed?
            </Typography>
          </div>

          {/* Custom Tabs */}
          <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
            {KYC_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setKycType(type.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  kycType === type.id
                    ? "bg-white text-[#346853] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Upload Area */}
          <div className="border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[320px]">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
              <FileText className="w-8 h-8" />
            </div>

            <Typography className="font-bold text-gray-900 mb-2">
              {activeKyc.description}
            </Typography>
            <Typography className="text-xs text-gray-400 max-w-[200px] mb-6">
              {activeKyc.sub}
            </Typography>

            {kycFile || savedKycName ? (
              <div className="w-full bg-blue-50 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-700 truncate">
                    {kycFile?.name || savedKycName}
                  </span>
                </div>
                <button
                  onClick={removeKycFile}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => kycInputRef.current?.click()}
                className="rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}

            <input
              type="file"
              ref={kycInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleKycFileChange}
            />

            <div className="flex gap-2 mt-8">
              <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-gray-500 font-medium">
                No glare
              </span>
              <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-gray-500 font-medium">
                High quality
              </span>
              <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-gray-500 font-medium">
                Valid expiry
              </span>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: RESTAURANT DOCUMENTS --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#346853] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <Typography
                variant="h4"
                className="font-bold text-gray-900 text-base"
              >
                Restaurant Documents
              </Typography>
            </div>
            <span className="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded-md uppercase tracking-wider">
              Select One
            </span>
          </div>

          {/* Custom Tabs */}
          <div className="bg-gray-50 p-1 rounded-xl flex gap-1">
            {DOC_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setDocType(type.id)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  docType === type.id
                    ? "bg-white text-[#346853] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Upload Area */}
          <div className="border border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-white shadow-sm min-h-[320px]">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500">
              <FileText className="w-8 h-8" />
            </div>

            <Typography className="font-bold text-gray-900 mb-2">
              {activeDoc.description}
            </Typography>
            <Typography className="text-xs text-gray-400 max-w-[200px] mb-6">
              {activeDoc.sub}
            </Typography>

            {docFile || savedDocName ? (
              <div className="w-full bg-emerald-50 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-emerald-700 truncate">
                    {docFile?.name || savedDocName}
                  </span>
                </div>
                <button
                  onClick={removeDocFile}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => docInputRef.current?.click()}
                className="rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            )}

            <input
              type="file"
              ref={docInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleDocFileChange}
            />

            <div className="flex gap-2 mt-8">
              <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-gray-500 font-medium">
                Official Doc
              </span>
              <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] text-gray-500 font-medium">
                Valid Date
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            prevStep();
            router.back();
          }}
          className="text-gray-400 font-bold hover:bg-transparent"
        >
          Back
        </Button>

        <div className="flex items-center gap-4">
          <Typography className="text-sm font-medium text-gray-500">
            Step 05 of 06
          </Typography>
          <Button
            onClick={handleComplete}
            disabled={
              (!kycFile && !savedKycName) || (!docFile && !savedDocName)
            }
            className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
