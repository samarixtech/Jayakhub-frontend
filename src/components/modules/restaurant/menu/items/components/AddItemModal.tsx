"use client";

import React from "react";
import { GlobalModal } from "@/components/common/GlobalModal";
import { useAddItem } from "../hooks/useAddItem";
import { StepSelection } from "./StepSelection";
import { StepBulkImport } from "./StepBulkImport";
import { StepPreview } from "./StepPreview";

interface AddItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  onImportSuccess?: () => void;
}

export function AddItemModal({
  open,
  onOpenChange,
  trigger,
  onImportSuccess,
}: AddItemModalProps) {
  const {
    step,
    setStep,
    dragActive,
    parsedData,
    headers,
    isLoading,
    inputRef,
    handleOpenChange,
    handleDrag,
    handleDrop,
    handleChange,
    handleImport,
    handleManualEntry,
    setParsedData,
  } = useAddItem(onOpenChange, onImportSuccess);

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/menu_import_template.csv";
    link.setAttribute("download", "menu_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GlobalModal
      open={open}
      onOpenChange={handleOpenChange}
      trigger={trigger}
      title={step === "selection" ? "Add New Item" : "Bulk Import Items"}
      className="sm:max-w-4xl max-h-[90vh] flex flex-col"
    >
      {step === "selection" && (
        <StepSelection
          onManualEntry={handleManualEntry}
          onBulkImport={() => setStep("bulk-import")}
        />
      )}

      {step === "bulk-import" && (
        <StepBulkImport
          onBack={() => setStep("selection")}
          onDownloadTemplate={handleDownloadTemplate}
          dragActive={dragActive}
          onDrag={handleDrag}
          onDrop={handleDrop}
          onFileInputClick={() => inputRef.current?.click()}
          inputRef={inputRef}
          onFileChange={handleChange}
        />
      )}

      {step === "preview" && (
        <StepPreview
          onBack={() => {
            setStep("bulk-import");
            setParsedData([]);
          }}
          parsedData={parsedData}
          headers={headers}
          isLoading={isLoading}
          onImport={handleImport}
          onCancel={() => handleOpenChange(false)}
        />
      )}
    </GlobalModal>
  );
}
