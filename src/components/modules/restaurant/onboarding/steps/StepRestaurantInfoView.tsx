"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import useLocale from "@/hooks/useLocals";
import { useOnboarding } from "@/components/modules/restaurant/onboarding/OnboardingContext";
import LocationPicker from "@/components/common/LocationPicker";
import { PhoneInput } from "@/components/ui/phone-input";

import { WizardStepProps } from "../types";

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

export default function StepRestaurantInfoView() {
  const { country, language } = useLocale();
  const router = useRouter();

  const { nextStep, prevStep } = useOnboarding();

  const form = useForm<RestaurantInfoInput>({
    resolver: zodResolver(restaurantInfoSchema),
    defaultValues: {
      restaurantName: "",
      restaurantPhone: "",
      restaurantEmail: "",
      websiteUrl: "",
      description: "",
      address: "",
      country: "",
      location: undefined,
    },
  });

  // Load data from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem("onboarding_restaurant_info");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Restore standard fields
        form.setValue("restaurantName", parsed.restaurantName || "");
        form.setValue("restaurantPhone", parsed.restaurantPhone || "");
        form.setValue("restaurantEmail", parsed.restaurantEmail || "");
        form.setValue("websiteUrl", parsed.websiteUrl || "");
        form.setValue("description", parsed.description || "");
        form.setValue("address", parsed.address || "");
        form.setValue("country", parsed.country || "");
        form.setValue("cuisineTypes", parsed.cuisineTypes || []);
        // logo and banner are still removed
        if (parsed.location) {
          form.setValue("location", parsed.location);
        }
      } catch (e) {
        console.error("Failed to parse saved restaurant info", e);
      }
    }
  }, [form]);

  const onSubmit = (data: RestaurantInfoInput) => {
    console.log("Static Mode: Saving Restaurant Info", data);

    // Persist text data (exclude File objects to avoid circular issues/empty objs)
    const dataToSave = {
      ...data,
      logo: undefined,
      banner: undefined,
    };
    localStorage.setItem(
      "onboarding_restaurant_info",
      JSON.stringify(dataToSave),
    );

    toast.success("Restaurant info saved");
    nextStep();
    router.push(
      `/${country}/${language}/restaurant/onboarding/step-brand-assets`,
    );
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
                    <PhoneInput
                      placeholder="+964 750 999 8888"
                      defaultCountry="IQ"
                      className="h-12 rounded-xl [&_button]:rounded-s-xl [&_input]:rounded-e-xl bg-gray-50/50 border-gray-100"
                      {...field}
                    />
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
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Country
                  </label>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Pakistan"
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

          {/* Section 3: Address & Map */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                Restaurant Location
              </label>
              <LocationPicker
                initialAddress={form.getValues("address")}
                initialLocation={form.getValues("location")}
                onLocationChange={(loc: {
                  lat: number;
                  lng: number;
                  address: string;
                  country?: string;
                }) => {
                  form.setValue("address", loc.address);
                  form.setValue("location", { lat: loc.lat, lng: loc.lng });
                  if (loc.country) {
                    form.setValue("country", loc.country);
                  }
                }}
                placeholder="Search for restaurant address..."
              />
            </div>
            <FormMessage>{form.formState.errors.address?.message}</FormMessage>
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

          {/* Section 5: Cuisine Types */}
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

          <div className="flex flex-col-reverse sm:flex-row justify-end items-center pt-4 border-t border-gray-50 gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                type="submit"
                disabled={false}
                className="w-full sm:w-auto bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
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
