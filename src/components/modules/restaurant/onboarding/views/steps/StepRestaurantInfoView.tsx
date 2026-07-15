"use client";

import { Store, Mail, Link as LinkIcon, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import LocationPicker from "@/components/common/LocationPicker";
import { PhoneInput } from "@/components/ui/phone-input";
import { useTranslations } from "next-intl";
import { useStepRestaurantInfo } from "../../hooks/useStepRestaurantInfo";
import { CuisineSelector } from "../../components/CuisineSelector";
// import RestaurantLocationMap from "../../components/RestaurantLocationMap";

export default function StepRestaurantInfoView() {
  const { form, onSubmit } = useStepRestaurantInfo();
  const t = useTranslations("Onboarding.restaurantInfoView");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Typography variant="h4" className="font-bold text-gray-900">
        {t("title")}
      </Typography>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="restaurantName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    {t("restaurantName")}
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Store className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={t("restaurantNamePlaceholder")}
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
                    {t("restaurantPhone")}
                  </label>
                  <FormControl>
                    <PhoneInput
                      placeholder={t("phonePlaceholder")}
                      maxLength={14}
                      defaultCountry="PK"
                      className="h-12 rounded-xl [&_button]:rounded-s-xl [&_input]:rounded-e-xl border-gray-100 bg-gray-50 focus-visible:ring-emerald-bg/10 focus-visible:border-emerald-bg transition-all"
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
                    {t("restaurantEmail")}
                  </label>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={t("restaurantEmailPlaceholder")}
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
                    {t("websiteUrl")}
                  </label>
                  <FormControl>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={t("websiteUrlPlaceholder")}
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

          {/* Section 2: Location */}
          <FormField
            control={form.control}
            name="address"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  {t("location")}
                </label>
                <FormControl>
                  <LocationPicker
                    initialAddress={field.value}
                    initialLocation={form.getValues("location")}
                    onLocationChange={(loc: any) => {
                      form.setValue("address", loc.address, { shouldValidate: true });
                      form.setValue("location", { lat: loc.lat, lng: loc.lng }, { shouldValidate: true });
                      if (loc.country) form.setValue("country", loc.country, { shouldValidate: true });
                    }}
                    placeholder={t("locationPlaceholder")}
                    error={!!fieldState.error}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section 3: Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400">
                  {t("description")}
                </label>
                <FormControl>
                  <div className="relative">
                    <Edit3 className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="min-h-[100px] pl-12 pt-3.5 bg-gray-50/50 border-gray-100 rounded-xl resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Section 4: Cuisines */}
          <CuisineSelector form={form} />

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443]"
            >
              {t("nextStep")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
