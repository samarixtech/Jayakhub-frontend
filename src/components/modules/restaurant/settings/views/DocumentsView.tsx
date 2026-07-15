"use client";
import React, { useState } from "react";
import {
  CreditCard,
  FileText,
  FileCheck,
  InfoIcon,
  UploadCloud,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SettingsData } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useDocumentSettings } from "../hooks/useDocumentSettings";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { updateKycAction } from "@/app/actions/restaurant/settings";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  getDocLabel,
  getDocCategory,
  getDocIcon,
  getStatusBadge,
} from "../utils/document.utils";
import { formatOrderDateTime } from "@/lib/utils/date";

function isoToDateOnly(isoStr: string): string {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return formatOrderDateTime(`${day}/${month}/${d.getFullYear()}`);
}

export default function DocumentsView({
  settings,
}: {
  settings: SettingsData | null;
}) {
  const t = useTranslations("RestaurantDashboard.Settings.documents");
  const router = useRouter();
  const { kyc, isPending, openDocument } = useDocumentSettings(settings);

  // Group 1: Identity Documents (ID Card, Passport, Driving License)
  const [docType1, setDocType1] = useState("government_id");
  const [file1, setFile1] = useState<File | null>(null);
  const [loading1, setLoading1] = useState(false);

  // Group 2: Operational & Tax Documents (Food License, Tax Certificate)
  const [docType2, setDocType2] = useState("food_license");
  const [file2, setFile2] = useState<File | null>(null);
  const [loading2, setLoading2] = useState(false);

  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile1(e.target.files[0]);
    }
  };

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile2(e.target.files[0]);
    }
  };

  const handleUpload1 = async () => {
    if (!file1) {
      toast.error(t("toasts.selectFile"));
      return;
    }
    setLoading1(true);
    const formData = new FormData();
    formData.append("documentType", docType1);
    formData.append("documentFile", file1);

    try {
      const response = await updateKycAction(formData);
      if (response.success) {
        toast.success(response.message || t("toasts.uploadSuccess"));
        setFile1(null);
        router.refresh();
      } else {
        toast.error(response.message || t("toasts.uploadFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("toasts.unexpectedError"));
    } finally {
      setLoading1(false);
    }
  };

  const handleUpload2 = async () => {
    if (!file2) {
      toast.error(t("toasts.selectFile"));
      return;
    }
    setLoading2(true);
    const formData = new FormData();
    formData.append("documentType", docType2);
    formData.append("documentFile", file2);

    try {
      const response = await updateKycAction(formData);
      if (response.success) {
        toast.success(response.message || t("toasts.uploadSuccess"));
        setFile2(null);
        router.refresh();
      } else {
        toast.error(response.message || t("toasts.uploadFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("toasts.unexpectedError"));
    } finally {
      setLoading2(false);
    }
  };

  // Filter Group 1 docs & check status
  const group1Docs = kyc.filter((doc: any) =>
    ["government_id", "passport", "driving_license"].includes(doc.documentType)
  );
  const hasActiveGroup1 = group1Docs.some(
    (doc: any) => doc.status === "pending" || doc.status === "verified" || doc.status === "approved"
  );

  // Filter Group 2 docs & check status
  const group2Docs = kyc.filter((doc: any) =>
    ["food_license", "tax_certificate"].includes(doc.documentType)
  );
  const hasActiveGroup2 = group2Docs.some(
    (doc: any) => doc.status === "pending" || doc.status === "verified" || doc.status === "approved"
  );

  return (
    <Card className="py-6">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {t("subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPending && (
          <Alert className="bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">
              {t("updatePendingTitle")}
            </AlertTitle>
            <AlertDescription className="text-blue-700">
              {t("updatePendingDesc")}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropdown One: Identity Documents */}
          {!hasActiveGroup1 && (
            <div className={`p-5 border border-dashed border-border rounded-xl bg-muted/30 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                {t("uploadIdentityProof", { defaultMessage: "Upload Identity Proof" })}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("docType")}
                  </Label>
                  <Select
                    disabled={isPending}
                    value={docType1}
                    onValueChange={setDocType1}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("selectType")} />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="government_id">{t("typeGovId")}</SelectItem>
                      <SelectItem value="passport">{t("typePassport")}</SelectItem>
                      <SelectItem value="driving_license">{t("typeLicense")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("selectFile")}
                  </Label>
                  <Input
                    type="file"
                    className="bg-background cursor-pointer file:text-primary file:font-semibold"
                    onChange={handleFileChange1}
                    disabled={isPending}
                    accept="image/*,.pdf"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleUpload1}
                    disabled={loading1 || isPending || !file1}
                    className="w-full md:w-auto"
                  >
                    {loading1 ? t("uploading") : t("uploadBtn")}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Dropdown Two: Operational Documents */}
          {!hasActiveGroup2 && (
            <div className={`p-5 border border-dashed border-border rounded-xl bg-muted/30 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-600" />
                {t("uploadOperationalDoc", { defaultMessage: "Upload Business & Tax Documents" })}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("docType")}
                  </Label>
                  <Select
                    disabled={isPending}
                    value={docType2}
                    onValueChange={setDocType2}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={t("selectType")} />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="food_license">{t("typeFoodLicense")}</SelectItem>
                      <SelectItem value="tax_certificate">
                        {t("typeTaxCertificate", { defaultMessage: "Tax Certificate" })}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("selectFile")}
                  </Label>
                  <Input
                    type="file"
                    className="bg-background cursor-pointer file:text-primary file:font-semibold"
                    onChange={handleFileChange2}
                    disabled={isPending}
                    accept="image/*,.pdf"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleUpload2}
                    disabled={loading2 || isPending || !file2}
                    className="w-full md:w-auto"
                  >
                    {loading2 ? t("uploading") : t("uploadBtn")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground">
            {t("docsOnFile")}
          </h3>

          {kyc.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileCheck className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{t("noDocs")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {kyc.map((doc: any) => {
                const DocIcon = getDocIcon(doc.documentType);
                const statusBadge = getStatusBadge(doc.status, t);
                const verifiedDate = doc.updatedAt
                  ? t("verifiedOn", { date: isoToDateOnly(doc.updatedAt) })
                  : "";

                return (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <DocIcon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {getDocLabel(doc.documentType, t)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getDocCategory(doc.documentType, t)}
                          {verifiedDate && ` • ${verifiedDate}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        onClick={() => openDocument(doc.documentFile)}
                      >
                        <div className="w-4 h-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        </div>
                      </Button>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold tracking-wide px-3 py-1 rounded-full ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
