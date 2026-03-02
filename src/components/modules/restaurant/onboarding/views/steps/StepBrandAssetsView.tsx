"use client";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Form } from "@/components/ui/form";
import { useStepBrandAssets } from "../../hooks/useStepBrandAssets";
import { OnboardingImageUpload } from "../../components/OnboardingImageUpload";

export default function StepBrandAssetsView() {
  const {
    form,
    logoPreview,
    bannerPreview,
    onSubmit,
    handleLogoChange,
    handleRemoveLogo,
    handleBannerChange,
    handleRemoveBanner,
  } = useStepBrandAssets();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Brand Assets
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <OnboardingImageUpload
              label="Upload Logo"
              preview={logoPreview}
              onFileChange={handleLogoChange}
              onRemove={handleRemoveLogo}
            />

            <OnboardingImageUpload
              label="Upload Cover Image"
              preview={bannerPreview}
              onFileChange={handleBannerChange}
              onRemove={handleRemoveBanner}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-50">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-emerald-bg text-white px-10 h-12 rounded-2xl font-bold hover:bg-emerald-bg-hover shadow-md shadow-emerald-900/10"
            >
              Next Step
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
