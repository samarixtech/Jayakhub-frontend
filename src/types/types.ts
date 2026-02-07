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

export interface ApiError {
  response?: {
    data?: {
      meta?: {
        message?: string;
      };
    };
  };
}

export interface GoogleButtonProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  country: string;
  language: string;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

// ADDRESS TYPES
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

export interface FormErrors {
  [key: string]: string;
}
