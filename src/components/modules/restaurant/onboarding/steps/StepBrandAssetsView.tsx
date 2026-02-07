"use client";

import { useRef, useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Image as ImageIcon, X, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Form } from "@/components/ui/form";

import {
  brandAssetsSchema,
  BrandAssetsInput,
} from "@/lib/schemas/restaurant-onboarding";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocals";

export default function StepBrandAssetsView() {
  const { country, language } = useLocale();
  const {
    nextStep,
    prevStep: contextPrevStep,
    setLogoPreview: setContextLogoPreview,
  } = useOnboarding();
  const router = useRouter();

  // Local state for previews
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BrandAssetsInput>({
    resolver: zodResolver(brandAssetsSchema),
    defaultValues: {
      logo: undefined,
      banner: undefined,
    },
  });

  // Helper to compress image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
          resolve(compressedBase64);
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Load data from LocalStorage
  useEffect(() => {
    // Load text data
    const savedData = localStorage.getItem("onboarding_brand_assets");
    if (savedData) {
      try {
        JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved brand assets", e);
      }
    }

    // Load previews
    const savedPreviews = localStorage.getItem(
      "onboarding_brand_assets_previews",
    );
    if (savedPreviews) {
      try {
        const { logo, banner } = JSON.parse(savedPreviews);
        if (logo) {
          setLogoPreview(logo);
          setContextLogoPreview(logo);
        }
        if (banner) {
          setBannerPreview(banner);
        }
      } catch (e) {
        console.error("Failed to parse saved previews", e);
      }
    }
  }, [setContextLogoPreview]);

  const onSubmit = (data: BrandAssetsInput) => {
    console.log("Static Mode: Saving Brand Assets", data);

    // Save previews to localStorage
    try {
      const previewsToSave = {
        logo: logoPreview,
        banner: bannerPreview,
      };
      localStorage.setItem(
        "onboarding_brand_assets_previews",
        JSON.stringify(previewsToSave),
      );
      toast.success("Brand assets saved");
    } catch (e) {
      console.error(
        "Failed to save previews to localStorage (quota exceeded?)",
        e,
      );
      toast.error("Images too large to save locally, but proceed anyway.");
    }

    nextStep();
    router.push(`/${country}/${language}/restaurant/onboarding/step-schedule`);
  };

  const onBack = () => {
    contextPrevStep();
    router.back();
  };

  const handleLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await compressImage(file);
        setLogoPreview(base64);
        setContextLogoPreview(base64);
        form.setValue("logo", file);
      } catch (err) {
        console.error("Error compressing logo", err);
        toast.error("Failed to process image");
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setContextLogoPreview(null);
    form.setValue("logo", undefined);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleBannerChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await compressImage(file);
        setBannerPreview(base64);
        form.setValue("banner", file);
      } catch (err) {
        console.error("Error compressing banner", err);
        toast.error("Failed to process image");
      }
    }
  };

  const handleRemoveBanner = () => {
    setBannerPreview(null);
    form.setValue("banner", undefined);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Brand Assets
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- LEFT: LOGO UPLOAD --- */}
            <div className="space-y-4">
              <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden group">
                {logoPreview ? (
                  <>
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveLogo}
                        className="rounded-full"
                        type="button"
                      >
                        <X className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-900 font-bold mb-1">
                      Upload Logo
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Recommended: 1200 x 400 px (3:1 ratio)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-white hover:border-gray-300"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      Choose Image
                    </Button>
                  </>
                )}
                <input
                  type="file"
                  ref={logoInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
              </div>

              {/* Tips Section */}
              <div className="space-y-3">
                <Typography
                  variant="h4"
                  className="font-bold text-gray-800 text-sm"
                >
                  Tips for a great cover:
                </Typography>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Show your most popular dishes
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Use natural lighting
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Keep text to a minimum
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Avoid blurry or low-quality images
                  </li>
                </ul>
              </div>
            </div>

            {/* --- RIGHT: BANNER UPLOAD --- */}
            <div className="space-y-4">
              <div className="border border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden group">
                {bannerPreview ? (
                  <>
                    <img
                      src={bannerPreview}
                      alt="Banner"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleRemoveBanner}
                        className="rounded-full"
                        type="button"
                      >
                        <X className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <h3 className="text-gray-900 font-bold mb-1">
                      Upload cover image
                    </h3>
                    <p className="text-xs text-gray-400 mb-6">
                      Recommended: 1200 x 400 px (3:1 ratio)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-gray-200 text-gray-700 font-bold hover:bg-white hover:border-gray-300"
                      onClick={() => bannerInputRef.current?.click()}
                    >
                      Choose Image
                    </Button>
                  </>
                )}
                <input
                  type="file"
                  ref={bannerInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleBannerChange}
                />
              </div>

              {/* Tips Section */}
              <div className="space-y-3">
                <Typography
                  variant="h4"
                  className="font-bold text-gray-800 text-sm"
                >
                  Tips for a great cover:
                </Typography>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Show your most popular dishes
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Use natural lighting
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Keep text to a minimum
                  </li>
                  <li className="flex items-center gap-2 text-xs text-gray-500">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Avoid blurry or low-quality images
                  </li>
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

            <div className="flex items-center gap-4">
              <Typography className="text-sm font-medium text-gray-500">
                Step 03 of 06
              </Typography>
              <Button
                type="submit"
                disabled={false}
                className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
              >
                Next Step
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
