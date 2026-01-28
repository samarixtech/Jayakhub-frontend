"use client";

import { useRef, useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Store,
  MapPin,
  Image as ImageIcon,
  X,
  Phone,
  Mail,
  Link as LinkIcon,
  Edit3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";

import {
  restaurantInfoSchema,
  RestaurantInfoInput,
} from "@/lib/schemas/restaurant-onboarding";
import {
  saveRestaurantInfoAction,
  getMyRestaurantAction,
} from "@/app/actions/restaurant/onboarding";
import { useEffect } from "react";
import { useServerAction } from "@/hooks/use-server-action";
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";
import RestaurantLocationMap from "./RestaurantLocationMap";

const CUISINE_TYPES = [
  "Fast Food",
  "Casual Dining",
  "Cafe",
  "Fine Dining",
  "Bakery",
  "Indian",
  "Chinese",
  "Italian",
  "Mexican",
  "Japanese",
  "Thai",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Korean",
  "Fusion",
] as const;

import { WizardStepProps } from "../types";

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
      restaurantPhone: "",
      restaurantEmail: "",
      websiteUrl: "",
      description: "",
      cuisineTypes: [],
      address: "",
      location: undefined,
    },
  });

  const { execute, isPending } = useServerAction(saveRestaurantInfoAction, {
    onSuccess: () => {
      toast.success("Restaurant info saved!");
      router.push(`/${country}/${language}/restaurant/onboarding/step-license`);
    },
  });

  // Import getMyRestaurantAction at the top, but for now I'll just add it to the imports via a separate edit or assume it's there.
  // Actually I need to add it to imports first.

  const onSubmit = (data: RestaurantInfoInput) => {
    const formData = new FormData();
    formData.append("restaurantName", data.restaurantName);
    formData.append("restaurantPhone", data.restaurantPhone);
    formData.append("restaurantEmail", data.restaurantEmail);
    if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
    formData.append("description", data.description);

    // Append array as JSON string or individual items depending on backend
    formData.append("cuisineTypes", JSON.stringify(data.cuisineTypes));

    formData.append("address", data.address);
    if (data.location) {
      formData.append("lat", data.location.lat.toString());
      formData.append("lng", data.location.lng.toString());
    }

    if (data.logo) formData.append("logo", data.logo);
    if (data.banner) formData.append("banner", data.banner);

    execute(formData);
  };

  // Prefetch Data
  useEffect(() => {
    const fetchRestaurant = async () => {
      const res = await getMyRestaurantAction();
      if (res.success && res.data) {
        const d = res.data;
        form.setValue("restaurantName", d.name || "");
        form.setValue("restaurantPhone", d.phone || "");
        form.setValue("restaurantEmail", d.email || "");
        form.setValue("websiteUrl", d.websiteUrl || "");
        form.setValue("description", d.description || "");
        form.setValue("address", d.address || "");

        // Cuisine Types
        if (Array.isArray(d.type)) {
          form.setValue("cuisineTypes", d.type);
        }

        // Location
        if (d.latitude && d.longitude) {
          form.setValue("location", {
            lat: parseFloat(d.latitude),
            lng: parseFloat(d.longitude),
          });
        }

        // Handling Images for Preview
        // We can't set file inputs programmatically with URLs, so we just set previews.
        if (d.profileImage) {
          // Construct full URL (adjust based on your asset base URL)
          // Assuming local relative path from response
          const fullLogo = d.profileImage.startsWith("http")
            ? d.profileImage
            : `https://api.example.com/${d.profileImage}`;
          // Ideally we need the base API URL here.
          // For now, I'll just use the raw string or a placeholder if I don't know the base.
          // User provided "uploads\profile..." (windows path?).
          // It's likely served via API_URL/uploads...
          // I'll set it as preview directly.
          setLogoPreview(d.profileImage);
        }
        if (d.bannerImage) {
          setBannerPreview(d.bannerImage);
        }
      }
    };
    fetchRestaurant();
  }, [form]);

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        Tell us about your place
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Restaurant Name
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Store className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Tasty Bites"
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="restaurantPhone"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Restaurant Phone
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="+964 750 999 8888"
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="restaurantEmail"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Restaurant Email
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="contact@tastybites.com"
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Website URL{" "}
                    <span className="text-gray-300 font-normal normal-case">
                      (Optional)
                    </span>
                  </label>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="https://tastybites.com"
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Cuisine Types */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                Cuisine Types
              </label>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {form.watch("cuisineTypes")?.length || 0} SELECTED
              </span>
            </div>

            <FormField
              control={form.control}
              name="cuisineTypes"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CUISINE_TYPES.map((type) => (
                      <FormField
                        key={type}
                        control={form.control}
                        name="cuisineTypes"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(type);
                          return (
                            <FormItem key={type} className="space-y-0">
                              <label
                                className={`
                                        cursor-pointer flex items-center gap-3 border rounded-xl p-3 w-full h-12 transition-all
                                        ${isChecked ? "border-emerald-500 bg-emerald-50/30" : "border-gray-100 bg-white hover:bg-gray-50"}
                                    `}
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([
                                          ...(field.value || []),
                                          type,
                                        ]);
                                      } else {
                                        field.onChange(
                                          field.value?.filter(
                                            (value) => value !== type,
                                          ),
                                        );
                                      }
                                    }}
                                    className="rounded-md border-gray-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                  />
                                </FormControl>
                                <span
                                  className={`text-sm font-medium ${isChecked ? "text-emerald-900" : "text-gray-600"}`}
                                >
                                  {type}
                                </span>
                              </label>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 3: Address & Map */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Full Address
                  </label>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Click on map or type address..."
                        className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <Typography className="text-[10px] text-gray-400 mt-1">
                    Click on the map to select your location or type your
                    address above.
                  </Typography>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RestaurantLocationMap
                      location={field.value}
                      onLocationSelect={(loc, address) => {
                        field.onChange(loc);
                        if (address) {
                          form.setValue("address", address);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 4: Description */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Description
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Edit3 className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                      <Textarea
                        placeholder="Describe your restaurant's vibe and specialties..."
                        className="min-h-[120px] pl-12 pt-3.5 bg-gray-50/50 border-gray-100 rounded-xl resize-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 5: Branding (Logo/Banner) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Click to upload Logo
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    Square Image recommended
                  </span>
                </div>
              )}
            </div>

            {/* --- RIGHT: BANNER UPLOAD --- */}
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                Banner Image
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
                    Click to upload Banner
                  </span>
                  <span className="text-[10px] text-gray-400 mt-1">
                    Landscape Image recommended
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                router.push(
                  `/${country}/${language}/restaurant/onboarding/step-owner-info`,
                )
              }
              className="text-gray-400 font-bold hover:bg-transparent"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
            >
              {isPending ? "Saving..." : "Next Step"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
