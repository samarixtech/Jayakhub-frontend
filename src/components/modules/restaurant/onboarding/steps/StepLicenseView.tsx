"use client";

import { useRef, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Upload, AlertCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { uploadRestaurantKycAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";
import {
  licenseSchema,
  LicenseInput,
} from "@/lib/schemas/restaurant-onboarding";
import { WizardStepProps } from "../types";

export default function StepLicenseView({ onNext, onBack }: WizardStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const form = useForm<LicenseInput>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseFile: undefined,
    },
  });

  const { execute, isPending } = useServerAction(uploadRestaurantKycAction, {
    onSuccess: () => {
      toast.success("License uploaded!");
      onNext();
    },
    onError: (err) => {
      toast.error(err || "Failed to upload license");
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue("licenseFile", file);
      setFilePreview(file.name);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      form.setValue("licenseFile", file);
      setFilePreview(file.name);
    }
  };

  const handleRemoveFile = () => {
    form.setValue("licenseFile", undefined);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: LicenseInput) => {
    const formData = new FormData();
    formData.append("documentType", "food_license");
    formData.append("documentFile", data.licenseFile);

    execute(formData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-[#111827]">
          Food Business License
        </Typography>
        <Typography className="text-gray-500 mt-1">
          Please upload your valid food business license or health permit to
          verify your restaurant is authorized to operate.
        </Typography>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* License Number Input - Optional but good for valid form */}

          {/* File Upload Area */}
          <FormField
            control={form.control}
            name="licenseFile"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div
                    className="border border-dashed border-gray-200 rounded-[20px] p-10 flex flex-col items-center justify-center bg-[#F9FAFB]"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    {field.value ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-[#346853]" />
                        </div>
                        <Typography className="text-[#111827] font-bold text-lg mb-2">
                          {filePreview || "Document Attached"}
                        </Typography>
                        <Typography className="text-gray-500 text-sm mb-6">
                          {(field.value.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleRemoveFile}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-[#346853]" />
                        </div>
                        <Typography className="text-[#111827] font-bold text-lg mb-2">
                          Upload Food License
                        </Typography>
                        <Typography className="text-gray-500 text-sm mb-6">
                          Click to browse or drag and drop your document here
                        </Typography>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf,.jpg,.png"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-[#346853] text-white px-6 h-10 rounded-lg font-bold hover:bg-[#2a5443]"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        <Typography className="text-gray-400 text-xs mt-4">
                          Supported formats: PDF, JPG, PNG (Max 10MB)
                        </Typography>
                      </>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-[#FFFBEB] border-l-4 border-[#F59E0B] p-4 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <Typography className="text-[#111827] font-bold text-sm mb-2">
                  License Requirements
                </Typography>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-1">
                  <li>
                    Must be a valid food business license or health permit
                  </li>
                  <li>Document should be clearly readable</li>
                  <li>License must not be expired</li>
                  <li>Business name should match your restaurant name</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-gray-400 font-bold hover:bg-transparent"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
            >
              {isPending ? "Uploading..." : "Next Step"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
