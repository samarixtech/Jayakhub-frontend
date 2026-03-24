"use client";
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

export default function DocumentsView({
  settings,
}: {
  settings: SettingsData | null;
}) {
  const t = useTranslations("RestaurantDashboard.Settings.documents");
  const {
    kyc,
    isPending,
    loading,
    docType,
    setDocType,
    file,
    handleFileChange,
    handleUpload,
    openDocument,
  } = useDocumentSettings(settings);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

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
              YOUR CHANGES ARE SUBMITTED, WE ARE REVIEWING IT AND WILL APPROVE
              SHORTLY.
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Section */}
        <div
          className={`p-5 border border-dashed border-border rounded-xl bg-muted/30 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
        >
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> {t("uploadTitle")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("docType")}
              </Label>
              <Select
                disabled={isPending}
                value={docType}
                onValueChange={setDocType}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={t("selectType")} />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="government_id">{t("typeGovId")}</SelectItem>
                  <SelectItem value="driving_license">
                    {t("typeLicense")}
                  </SelectItem>
                  <SelectItem value="passport">{t("typePassport")}</SelectItem>
                  <SelectItem value="food_license">{t("typeFoodLicense")}</SelectItem>
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
                onChange={handleFileChange}
                disabled={isPending}
                accept="image/*,.pdf"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={loading || isPending || !file}
            >
              {loading ? t("uploading") : t("uploadBtn")}
            </Button>
          </div>
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
                const statusBadge = getStatusBadge(doc.status);
                const verifiedDate = doc.updatedAt
                  ? t("verifiedOn", { date: formatDate(doc.updatedAt) })
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
                          {getDocLabel(doc.documentType)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getDocCategory(doc.documentType)}
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
