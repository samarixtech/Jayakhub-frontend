import { useRef, ChangeEvent } from "react";
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
import { StepRestaurantInfoProps } from "../types";

export const StepRestaurantInfo = ({
  logoPreview,
  onLogoUpload,
  onRemoveLogo,
  bannerPreview,
  onBannerUpload,
  onRemoveBanner,
}: StepRestaurantInfoProps) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onLogoUpload(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onBannerUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Typography variant={"h4"} className="font-bold text-gray-900">
        Tell us about your place
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Name */}
        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-bold uppercase text-gray-400">
            Restaurant Name
          </label>
          <div className="relative">
            <Store className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
            <Input className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Cuisine Type */}
        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-bold uppercase text-gray-400">
            Cuisine Type
          </label>
          <Select>
            <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-xl">
              <SelectValue placeholder="Select cuisine" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fastfood">Fast Food</SelectItem>
              <SelectItem value="fine_dining">Fine Dining</SelectItem>
              <SelectItem value="cafe">Cafe</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div className="space-y-2 col-span-2">
          <label className="text-[10px] font-bold uppercase text-gray-400">
            Full Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
            <Input className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl" />
          </div>
        </div>

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
                  onClick={onRemoveLogo}
                  className="rounded-full"
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
                  onClick={onRemoveBanner}
                  className="rounded-full"
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
    </div>
  );
};
