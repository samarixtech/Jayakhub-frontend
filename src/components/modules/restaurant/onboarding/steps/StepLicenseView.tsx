"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FileText, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  licenseSchema,
  LicenseInput,
} from "@/lib/schemas/restaurant-onboarding";
import { saveLicenseAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";
import useLocale from "@/hooks/useLocals";

export default function StepLicenseView() {
  const router = useRouter();
  const { country, language } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<LicenseInput>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      licenseNumber: "",
    },
  });

  const { execute, isPending } = useServerAction(saveLicenseAction, {
    onSuccess: () => {
      toast.success("License info saved!");
      router.push(`/${country}/${language}/restaurant/onboarding/step-kyc`);
    },
  });

  const onSubmit = (data: LicenseInput) => {
    if (!selectedFile) {
      toast.error("Please upload the license document");
      return;
    }
    const formData = new FormData();
    formData.append("licenseNumber", data.licenseNumber);
    formData.append("licenseFile", selectedFile);
    execute(formData);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      form.setValue("licenseFile", file, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue("licenseFile", undefined, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Business License
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  License Number
                </label>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                      placeholder="e.g. LIC-12345678"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">
              Upload License Document
            </label>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,image/*"
              onChange={handleFileChange}
            />

            {selectedFile ? (
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate block">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50/50 transition-colors group"
              >
                <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={20} />
                </div>
                <p className="text-sm font-bold text-gray-700">
                  Click to upload license
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF or Images (max 5MB)
                </p>
              </div>
            )}
            {form.formState.errors.licenseFile && (
              <p className="text-sm font-medium text-destructive mt-2">
                {form.formState.errors.licenseFile.message as string}
              </p>
            )}
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
              type="submit"
              disabled={isPending}
              className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
            >
              {isPending ? "Saving..." : "Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
