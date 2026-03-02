"use client";
import {
  User,
  Store,
  Clock,
  FileText,
  CreditCard,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useStepReview } from "../../hooks/useStepReview";
import {
  ReviewSection,
  ReviewInfoRow,
} from "../../components/ReviewComponents";

export default function StepReviewView() {
  const { data, loading, isPending, handleSubmit, onBack, pathPrefix } =
    useStepReview();

  if (!data.owner)
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-bg"></div>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Typography variant="h3" className="text-xl font-bold text-gray-900">
          Review Application
        </Typography>
        <Typography className="text-gray-500 mt-1">
          Please review your information before final submission.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Info */}
        <ReviewSection
          icon={User}
          title="Owner"
          stepPath={`${pathPrefix}/step-owner-info`}
        >
          <ReviewInfoRow label="Name" value={data.owner.ownerName} />
          <ReviewInfoRow label="Phone" value={data.owner.ownerPhone} />
        </ReviewSection>

        {/* Bank Details */}
        <ReviewSection
          icon={CreditCard}
          title="Bank"
          stepPath={`${pathPrefix}/step-bank-details`}
        >
          <ReviewInfoRow label="Title" value={data.bank.accountTitle} />
          <ReviewInfoRow label="Bank" value={data.bank.bankName} />
          <ReviewInfoRow label="Type" value={data.bank.accountType} />
          <ReviewInfoRow label="IBAN" value={data.bank.iban} />
        </ReviewSection>

        {/* Restaurant Info */}
        <ReviewSection
          icon={Store}
          title="Restaurant"
          stepPath={`${pathPrefix}/step-restaurant-info`}
        >
          <ReviewInfoRow label="Name" value={data.restaurant.restaurantName} />
          <ReviewInfoRow
            label="Email"
            value={data.restaurant.restaurantEmail}
          />
          <ReviewInfoRow
            label="Phone"
            value={data.restaurant.restaurantPhone}
          />
          <ReviewInfoRow label="Address" value={data.restaurant.address} />
          <ReviewInfoRow
            label="Cuisines"
            value={data.restaurant.cuisineTypes?.join(", ")}
          />
        </ReviewSection>

        {/* Operating Hours */}
        <ReviewSection
          icon={Clock}
          title="Hours"
          stepPath={`${pathPrefix}/step-schedule`}
        >
          <div className="grid grid-cols-1 gap-1">
            {Object.entries(data.schedule || {}).map(
              ([day, hours]: [string, any]) => (
                <div
                  key={day}
                  className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0"
                >
                  <span className="capitalize text-gray-500 font-medium">
                    {day}
                  </span>
                  <span className="text-gray-900 font-bold">
                    {hours.isOpen
                      ? `${hours.openTime} - ${hours.closeTime}`
                      : "Closed"}
                  </span>
                </div>
              ),
            )}
          </div>
        </ReviewSection>

        {/* Brand Assets */}
        <ReviewSection
          icon={ImageIcon}
          title="Assets"
          stepPath={`${pathPrefix}/step-brand-assets`}
        >
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <Typography className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                Logo
              </Typography>
              {data.assets?.logo ? (
                <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-gray-100">
                  <Image
                    fill
                    src={data.assets.logo}
                    alt="Logo"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                  NO LOGO
                </div>
              )}
            </div>
            <div>
              <Typography className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                Banner
              </Typography>
              {data.assets?.banner ? (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-gray-100">
                  <Image
                    fill
                    src={data.assets.banner}
                    alt="Banner"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                  NO BANNER
                </div>
              )}
            </div>
          </div>
        </ReviewSection>

        {/* KYC Documents */}
        <ReviewSection
          icon={FileText}
          title="KYC"
          stepPath={`${pathPrefix}/step-kyc`}
        >
          <ReviewInfoRow label="Identity" value={data.kyc?.kycName} />
          <ReviewInfoRow label="Business" value={data.kyc?.docName} />
        </ReviewSection>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-center pt-8 border-t border-gray-100 gap-4 sm:gap-0">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-400 font-bold hover:bg-transparent"
        >
          Back
        </Button>

        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Final Step 07/07
          </span>
          <Button
            onClick={handleSubmit}
            disabled={isPending || loading}
            className="w-full sm:w-auto bg-emerald-bg text-white px-12 h-12 rounded-2xl font-bold hover:bg-emerald-bg-hover shadow-lg shadow-emerald-900/10 min-w-[240px]"
          >
            {isPending || loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
