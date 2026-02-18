export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  websiteUrl?: string;
  type: string[];
  profileImage: string;
  bannerImage: string;
  status: string;
  ownerEmail?: string;
  restaurantEmail?: string;
  verifiedVia?: string;
}

export interface LocationData {
  address: string;
  latitude: string;
  longitude: string;
  country: string;
}

export interface ScheduleData {
  id: string;
  restaurantId: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

export interface BankAccountData {
  id: string;
  accountHolderName: string;
  accountType: string;
  bankName: string;
  iban: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface KycData {
  id: string;
  userId: string;
  documentType: string;
  status: string;
  documentFile: string;
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingUpdateStatus {
  location: "pending" | "approved" | "none";
  bankDetails: "pending" | "approved" | "none";
  kyc: "pending" | "approved" | "none";
}

export interface SettingsData {
  profile: ProfileData;
  location: LocationData;
  schedules: ScheduleData[];
  bankAccount: BankAccountData;
  kyc: KycData[];
  onboardingUpdate: OnboardingUpdateStatus;
}
