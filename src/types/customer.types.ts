export interface ProfileData {
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
