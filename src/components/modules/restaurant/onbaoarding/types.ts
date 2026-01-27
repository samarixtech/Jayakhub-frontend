export interface StepRestaurantInfoProps {
  logoPreview: string | null;
  onLogoUpload: (file: File) => void;
  onRemoveLogo: () => void;
  bannerPreview: string | null;
  onBannerUpload: (file: File) => void;
  onRemoveBanner: () => void;
}
