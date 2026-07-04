"use client";

import { useState } from "react";
import Image from "next/image";
import {
  User,
  Store,
  Clock,
  MapPin,
  FileText,
  Image as ImageIcon,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Checkbox } from "@/components/ui/checkbox";
import { useStepReview } from "../../hooks/useStepReview";
import {
  ReviewContainer,
  ReviewSection,
  ReviewField,
  ReviewDocField,
} from "../../components/ReviewComponents";
import Link from "next/link";

const epochToDisplayTime = (epoch: number | string | null | undefined): string => {
  const num = Number(epoch);
  if (!num || num < 86400000) return "";
  const d = new Date(num);
  const h = d.getUTCHours().toString().padStart(2, "0");
  const m = d.getUTCMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

export default function StepReviewView() {
  const { data, loading, isPending, handleSubmit, pathPrefix } =
    useStepReview();
  const [agreed, setAgreed] = useState(false);

  if (!data?.owner)
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-bg"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="px-4 md:px-0">
        <Typography variant="h3" className="text-3xl font-black text-gray-900">
          Review your application
        </Typography>
        <Typography className="text-gray-500 mt-2 text-sm">
          Please review all information before submitting. You can edit any
          section if needed.
        </Typography>
      </div>

      <ReviewContainer>
        {/* Owner Information */}
        <ReviewSection
          icon={User}
          title="Owner Information"
          stepPath={`${pathPrefix}/step-owner-info`}
        >
          <ReviewField label="Full Name" value={data.owner.ownerName} />
          <ReviewField label="Contact Phone" value={data.owner.ownerPhone} />
          <ReviewField
            label="Email Address"
            value={data.owner.ownerEmail || data.restaurant?.restaurantEmail}
            fullWidth
          />
        </ReviewSection>

        {/* Restaurant Details */}
        <ReviewSection
          icon={Store}
          title="Restaurant Details"
          stepPath={`${pathPrefix}/step-restaurant-info`}
        >
          <ReviewField
            label="Restaurant Name"
            value={data.restaurant?.restaurantName}
          />
          <ReviewField
            label="Restaurant Phone"
            value={data.restaurant?.restaurantPhone}
          />
          <ReviewField
            label="Restaurant Email"
            value={data.restaurant?.restaurantEmail}
          />
          <ReviewField
            label="Website URL"
            value={data.restaurant?.websiteUrl}
          />
          <ReviewField
            label="Cuisine Types"
            value={data.restaurant?.cuisineTypes?.join(", ")}
            fullWidth
          />
          <ReviewField
            label="Description"
            value={data.restaurant?.description}
            fullWidth
          />
        </ReviewSection>

        {/* Location */}
        <ReviewSection
          icon={MapPin}
          title="Location"
          stepPath={`${pathPrefix}/step-restaurant-info`}
        >
          <ReviewField
            label="Full Address"
            value={data.restaurant?.address}
            fullWidth
          />
        </ReviewSection>

        {/* Brand Assets */}
        <ReviewSection
          icon={ImageIcon}
          title="Brand Assets"
          stepPath={`${pathPrefix}/step-brand-assets`}
        >
          <div className="flex flex-col md:flex-row gap-4 md:col-span-2">
            <div className="w-full md:w-32">
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Logo
              </Typography>
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                {data.assets?.logo ? (
                  <Image
                    fill
                    src={data.assets.logo}
                    alt="Logo"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Cover Image
              </Typography>
              <div className="relative aspect-video md:aspect-3/1 w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                {data.assets?.banner ? (
                  <Image
                    fill
                    src={data.assets.banner}
                    alt="Banner"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
            </div>
          </div>
        </ReviewSection>

        {/* Operations Schedule */}
        <ReviewSection
          icon={Clock}
          title="Operations Schedule"
          stepPath={`${pathPrefix}/step-schedule`}
        >
          {data.timezone && (
            <ReviewField label="Timezone" value={data.timezone} fullWidth />
          )}
          <ReviewField
            label="Operating Hours"
            fullWidth
            value={
              <div className="space-y-1 mt-1">
                {Object.entries(data.schedule || {})
                  .filter(([key, h]: any) => key !== "timezone" && h?.isOpen)
                  .length > 0 ? (
                  Object.entries(data.schedule || {})
                    .filter(([key]) => key !== "timezone")
                    .map(
                      ([day, hours]: [string, any]) =>
                        hours.isOpen && (
                          <div key={day} className="flex justify-between text-xs">
                            <span className="capitalize">{day}</span>
                            <span>
                              {epochToDisplayTime(hours.openTime)} -{" "}
                              {epochToDisplayTime(hours.closeTime)}
                            </span>
                          </div>
                        ),
                    )
                ) : (
                  <span className="text-gray-500">Not set</span>
                )}
              </div>
            }
          />
        </ReviewSection>

        {/* Legal & Banking */}
        <ReviewSection
          icon={FileText}
          title="Legal & Banking"
          stepPath={`${pathPrefix}/step-kyc`}
        >
          <ReviewDocField
            label="Owner's Government ID (KYC)"
            status={data.kyc?.kycName ? "UPLOADED" : "PENDING"}
          />
          <ReviewDocField
            label="Food License / Health Permit"
            status={data.kyc?.docName ? "UPLOADED" : "PENDING"}
          />
          <ReviewField label="Account Holder" value={data.bank?.accountTitle} />
          <ReviewField label="Bank Name" value={data.bank?.bankName} />
          <ReviewField label="IBAN No" value={data.bank?.iban} fullWidth />
        </ReviewSection>
      </ReviewContainer>

      {/* Confirmation */}
      <div className="bg-emerald-50/50 rounded-2xl p-4 flex items-start gap-4 border border-emerald-100/50">
        <Checkbox
          id="confirm"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked as boolean)}
          className="mt-1 border-emerald-200 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
        />
        <label
          htmlFor="confirm"
          className="text-[11px] md:text-xs text-emerald-800/70 leading-relaxed font-medium cursor-pointer"
        >
          I confirm that all information provided is accurate and I agree to
          JayakHub's{" "}
          <Link
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold underline hover:text-emerald-900"
          >
            Terms of Service
          </Link>
          ,{" "}

          Merchant Agreement

          , and{" "}
          <Link
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 font-bold underline hover:text-emerald-900"
          >
            Privacy Policy
          </Link>
          . I understand that false information may result in account
          suspension.
        </label>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-6">
        <Button
          onClick={handleSubmit}
          disabled={isPending || loading || !agreed}
          className="w-full md:w-auto bg-[#346853] text-white px-10 h-12 rounded-xl font-bold hover:bg-[#2a5443] transition-all flex items-center justify-center gap-2"
        >
          {isPending || loading ? "Submitting..." : "Submit Application"}
          {!isPending && !loading && (
            <div className="bg-white/20 rounded-md p-1">
              <Edit className="w-3 h-3 rotate-135" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
