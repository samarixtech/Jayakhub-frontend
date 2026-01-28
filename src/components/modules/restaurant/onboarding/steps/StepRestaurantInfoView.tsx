"use client";

import { useRef, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Store, MapPin, Image as ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  restaurantInfoSchema,
  RestaurantInfoInput,
} from "@/lib/schemas/restaurant-onboarding";
import { saveRestaurantInfoAction } from "@/app/actions/restaurant/onboarding";
import { useServerAction } from "@/hooks/use-server-action";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";

export default function StepRestaurantInfoView() {
  const router = useRouter();
  const { country, language } = useLocale();
  const { setLogoPreview: setContextLogoPreview } = useOnboarding();

  // Local state for previews
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<RestaurantInfoInput>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: {
      restaurantName: "",
      cuisineType: "",
      address: "",
    },
  });

  const { execute, isPending } = useServerAction(saveRestaurantInfoAction, {
    onSuccess: () => {
      toast.success("Restaurant info saved!");
      router.push(`/${country}/${language}/restaurant/onboarding/step-schedule`);
    },
  });

  const onSubmit = (data: RestaurantInfoInput) => {
    const formData = new FormData();
    formData.append("restaurantName", data.restaurantName);
    formData.append("cuisineType", data.cuisineType);
    formData.append("address", data.address);
    if (data.logo) formData.append("logo", data.logo);
    if (data.banner) formData.append("banner", data.banner);

    execute(formData);
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
      setContextLogoPreview(objectUrl);
      form.setValue("logo", file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setContextLogoPreview(null);
    form.setValue("logo", undefined);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      setBannerPreview(objectUrl);
      form.setValue("banner", file);
    }
  };

  const handleRemoveBanner = () => {
    setBannerPreview(null);
    form.setValue("banner", undefined);
    if (bannerInputRef.current) bannerInputRef.current.value = "";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Tell us about your place
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Restaurant Name */}
            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Restaurant Name
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Store className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cuisine Type */}
            <FormField
              control={form.control}
              name="cuisineType"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Cuisine Type
                  </label>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-xl">
                        <SelectValue placeholder="Select cuisine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fastfood">Fast Food</SelectItem>
                      <SelectItem value="fine_dining">Fine Dining</SelectItem>
                      <SelectItem value="cafe">Cafe</SelectItem>
                      <SelectItem value="casual">Casual Dining</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Full Address
                  </label>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- LEFT: LOGO UPLOAD --- */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                Restaurant Logo
              </label>

              <input
                type="file"
                ref={logoInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />

              {logoPreview ? (
                <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-gray-100 group">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>
              ) : (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="h-40 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Upload Logo
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    Square (1:1)
                  </span>
                </div>
              )}
            </div>

            {/* --- RIGHT: BANNER UPLOAD --- */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                Cover / Banner Image
              </label>

              <input
                type="file"
                ref={bannerInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleBannerChange}
              />

              {bannerPreview ? (
                <div className="relative h-40 w-full rounded-2xl overflow-hidden border-2 border-gray-100 group">
                  <img
                    src={bannerPreview}
                    alt="Banner Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                </div>
              ) : (
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="h-40 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-500">
                    Upload Banner
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    Landscape (16:9)
                  </span>
                </div>
              )}
            </div>
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
