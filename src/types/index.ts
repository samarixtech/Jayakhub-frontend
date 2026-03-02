// ============================================================================
// API & GENERAL TYPES
// ============================================================================

// Standard API response wrapper expected from the backend.
export interface ApiResponse {
  meta: {
    status: number;
    message: string;
  };
  data: {
    status: string;
    message: string;
  };
}

// Standard API error wrapper.
export interface ApiError {
  response?: {
    data?: {
      meta?: {
        message?: string;
      };
    };
  };
}

// Component props for the generic generic form errors object.
export interface FormErrors {
  [key: string]: string;
}

// ============================================================================
// AUTHENTICATION & THIRD-PARTY INTEGRATION TYPES
// ============================================================================

// Form properties for Google OAuth button component.
export interface GoogleButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  country: string;
  language: string;
}

// OAuth payload from Google containing user credentials.
export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

// ============================================================================
// RESTAURANT SPECIFIC LOGIC & SETTINGS TYPES
// ============================================================================

// Represents a Restaurant's profile details.
export interface RestaurantProfileData {
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

// Represents the geographic location configuration of the restaurant.
export interface LocationData {
  address: string;
  latitude: string;
  longitude: string;
  country: string;
}

// Represents business hours for a specific day for a restaurant.
export interface ScheduleData {
  id: string;
  restaurantId: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

// Bank and payout information associated with a restaurant.
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

// KYC (Know Your Customer) compliance document data for the restaurant.
export interface KycData {
  id: string;
  userId: string;
  documentType: string;
  status: string;
  documentFile: string;
  createdAt: string;
  updatedAt: string;
}

// Aggregated status of onboarding completion/approvals.
export interface OnboardingUpdateStatus {
  location: "pending" | "approved" | "none";
  bankDetails: "pending" | "approved" | "none";
  kyc: "pending" | "approved" | "none";
}

// Comprehensive settings aggregated state for a restaurant dashboard.
export interface SettingsData {
  profile: RestaurantProfileData;
  location: LocationData;
  schedules: ScheduleData[];
  bankAccount: BankAccountData;
  kyc: KycData[];
  onboardingUpdate: OnboardingUpdateStatus;
}

// ============================================================================
// RESTAURANT ONBOARDING TYPES
// ============================================================================

// Shared props injected down into individual onboarding Wizard steps.
export interface WizardStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

// Configuration props for the initial restaurant info onboarding step.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepRestaurantInfoProps extends WizardStepProps { }

// Configuration props for the restaurant license onboarding step.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepLicenseProps extends WizardStepProps { }

// ============================================================================
// CUSTOMER TYPES
// ============================================================================

// Represents a Customer's profile details on the user platform.
export interface CustomerProfileData {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
  role?: {
    name: string;
  };
}

// General Address Entity representing typical user address records.
export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  type: "home" | "office" | "other";
  createdAt: string;
  updatedAt: string;
}

// Form payload definition for managing User addresses.
export interface AddressFormData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  area: string;
  postalCode: string;
  latitude: string;
  longitude: string;
  isDefault: boolean;
  type: "home" | "office" | "other";
}

// ============================================================================
// MENU & CART TYPES
// ============================================================================

// Core definition of a restaurant food menu item.
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image?: string;
  category?: string;
  isAvailable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  variations?: any[];
  basePrice?: number;
}

// A MenuItem that is currently stored inside the User Cart.
export interface CartItem extends MenuItem {
  cartId?: string;
  quantity: number;
  productId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedVariations?: any[];
  selectedVariation?: { name: string; additionalPrice: number };
  restaurantName?: string;
  restaurantId?: string;
  totalPrice?: number;
  cashierItemId?: string;
  tableName?: string;
  orderType?: string;
  paymentMethod?: string;
}

// Summary snippet object highlighting a restaurant, usually used in recommendation rails.
export interface SimilarRestaurant {
  id: string;
  name: string;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisine: string[];
  promoText?: string;
}

// Represents structure for creating MenuItems in bulk via CSV imports.
export interface BulkImportItem {
  name: string;
  description: string;
  category: string;
  dietaryType: string;
  basePrice: number;
  isAvailable: boolean;
  variations: {
    groupName: string;
    options: { name: string; price: number }[];
  }[];
  itemImage?: string;
}
