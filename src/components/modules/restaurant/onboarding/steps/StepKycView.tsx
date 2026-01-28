"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Upload,
  CreditCard,
  Car,
  BookOpen,
  Info,
  CheckCircle,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { uploadRestaurantKycAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";
import useLocale from "@/hooks/useLocals";
import { KycInput } from "@/lib/schemas/restaurant-onboarding";

const DOCUMENTS = [
  {
    id: "government_id",
    title: "Government ID",
    description: "National ID Card",
    icon: CreditCard,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    id: "driving_license",
    title: "Driving License",
    description: "Valid Driver's License",
    icon: Car,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: "passport",
    title: "Passport",
    description: "International Passport",
    icon: BookOpen,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
] as const;

import { WizardStepProps } from "../types";

export default function StepKycView({ onBack }: WizardStepProps) {
  const router = useRouter();
  const { country, language } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { execute, isPending } = useServerAction(uploadRestaurantKycAction, {
    onSuccess: () => {
      toast.success("Verification documents submitted!");
      // Redirect to dashboard
      router.push(`/${country}/${language}/restaurant/dashboard`);
    },
    onError: (err) => {
      toast.error(err || "Failed to submit documents");
    },
  });

  const handleUploadClick = (typeId: string) => {
    setSelectedType(typeId);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success("Document attached");
    } else {
      // If cancelled and no file previously, reset type
      if (!selectedFile) setSelectedType(null);
    }
  };

  const handleComplete = () => {
    if (!selectedFile || !selectedType) {
      toast.error("Please upload a document to proceed");
      return;
    }

    const formData = new FormData();
    // User requested to send the specific type key (e.g. government_id)
    formData.append(selectedType, selectedFile);

    execute(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf"
      />

      {/* Header Section */}
      <div className="space-y-1">
        <Typography variant={"h4"} className="font-bold text-gray-900">
          Identity Verification
        </Typography>
        <Typography className="text-sm text-slate-500">
          Please upload one of the following documents to verify your business
          identity.
        </Typography>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {DOCUMENTS.map((doc) => {
          const isSelected = selectedType === doc.id && selectedFile;

          return (
            <div
              key={doc.id}
              className={`flex items-center justify-between p-5 bg-white border rounded-2xl shadow-sm transition-all ${isSelected ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/10" : "border-slate-100 hover:border-emerald-100"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${doc.iconBg}`}
                >
                  {isSelected ? (
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <doc.icon className={`h-6 w-6 ${doc.iconColor}`} />
                  )}
                </div>
                <div>
                  <Typography className="font-bold text-slate-900">
                    {doc.title}
                  </Typography>
                  <Typography className="text-xs text-slate-400">
                    {isSelected ? selectedFile?.name : doc.description}
                  </Typography>
                </div>
              </div>

              {isSelected ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUploadClick(doc.id)}
                  className="text-emerald-600 font-bold hover:bg-emerald-50"
                >
                  Change
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleUploadClick(doc.id)}
                  className="border-slate-200 text-slate-700 font-bold px-6 h-10 rounded-xl hover:bg-slate-50 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="bg-emerald-50/50 border border-emerald-50 p-5 rounded-2xl flex gap-3 items-start mt-8">
        <Info className="h-5 w-5 text-emerald-600 mt-0.5" />
        <Typography className="text-sm text-emerald-800 leading-relaxed">
          By clicking <span className="font-bold">"Complete Setup"</span>, you
          agree to our Partner Terms & Conditions and Privacy Policy. Your
          restaurant will be reviewed within 24 hours.
        </Typography>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          className="text-gray-400 font-bold hover:bg-transparent"
        >
          Back
        </Button>

        <Button
          onClick={handleComplete}
          disabled={isPending || !selectedFile}
          className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
        >
          {isPending ? "Proccessing..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
}
