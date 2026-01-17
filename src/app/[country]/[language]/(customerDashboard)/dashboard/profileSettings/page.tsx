"use client";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Loader2,
  X,
  Briefcase,
  Calendar,
  Shield,
  Lock,
  AlertCircle,
  Building,
  Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import api from "@/components/services/api";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  jobTitle?: string;
  memberSince?: string;
  department?: string;
}

interface UserUpdateResponse {
  data: Partial<UserProfile>; // backend may return only updated fields
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  submit?: string;
}

const defaultProfile: UserProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  avatar: "",
  jobTitle: "Senior Product Designer",
  memberSince: "January 2023",
  department: "Product Design",
};

const ProfileInputField = ({
  id,
  label,
  value,
  Icon,
  type = "text",
  error,
  disabled,
  description,
  handleChange,
}: {
  id: keyof UserProfile;
  label: string;
  value: string;
  Icon: any;
  type?: string;
  error?: string;
  disabled: boolean;
  description?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {description && (
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          {description}
        </span>
      )}
    </div>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <Icon
          className={`transition-colors ${
            disabled
              ? "text-gray-400"
              : "text-emerald-600 group-hover:text-emerald-700"
          }`}
          size={18}
        />
      </div>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full pl-12 pr-4 py-3.5 text-gray-900 border rounded-xl
          transition-all duration-200 font-medium
          ${
            disabled
              ? "bg-gray-50/60 border-gray-200 cursor-not-allowed text-gray-600"
              : `
            bg-white border-gray-300
            focus:outline-none focus:ring-3 focus:ring-emerald-500/20
            focus:border-emerald-500
            hover:border-emerald-400
          `
          }
          ${
            error
              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
              : ""
          }
          placeholder-shown:text-gray-500
          shadow-sm
        `}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
    {error && (
      <p className="text-sm font-medium text-rose-600 flex items-center gap-2 mt-2">
        <AlertCircle size={14} className="shrink-0" />
        {error}
      </p>
    )}
  </div>
);

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [originalProfile, setOriginalProfile] =
    useState<UserProfile>(defaultProfile);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsFetching(true);
        const response = await api.get<{ data: any }>("/user/me");
        const data = response.data?.data;

        const userProfile: UserProfile = {
          name: data.fullName || data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "Add location",
          avatar:
            data.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${
              data.email || "User"
            }&backgroundColor=0b5d4e`,
          jobTitle: data.jobTitle || "Senior Product Designer",
          memberSince: data.memberSince || "January 2023",
          department: data.department || "Product Design",
        };

        setProfile(userProfile);
        setOriginalProfile(userProfile);
      } catch (error: any) {
        console.error("Failed to fetch user profile:", error);
        setErrors((prev) => ({
          ...prev,
          submit:
            error.response?.data?.message ||
            "Unable to load profile. Please try again.",
        }));
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const hasTextChanges =
      JSON.stringify(profile) !== JSON.stringify(originalProfile);
    setHasUnsavedChanges(hasTextChanges || newAvatarFile !== null);
  }, [profile, originalProfile, newAvatarFile]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, submit: undefined }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isEditing) setIsEditing(true);

    if (file.size > 15 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        submit: "Image size must be less than 5MB",
      }));
      return;
    }

    setNewAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    } else if (profile.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!profile.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^\+?[\d\s()-]{10,20}$/.test(profile.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!profile.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!hasUnsavedChanges) {
      setErrors((prev) => ({ ...prev, submit: "No changes to save." }));
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("location", profile.location);

      if (newAvatarFile) {
        formData.append("avatar", newAvatarFile);
      } else {
        formData.append("avatar", originalProfile.avatar);
      }

      const response = await api.put<UserUpdateResponse>("/user/me", formData);
      const updatedData = response.data;

      setProfile((prev) => ({
        ...prev,
        ...updatedData,
      }));
      setOriginalProfile((prev) => ({
        ...prev,
        ...updatedData,
      }));

      setNewAvatarFile(null);
      setSuccess(true);
      setIsEditing(false);
      setErrors({});
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Discard changes and exit edit mode?"
      );
      if (!confirmed) return;
    }
    setProfile(originalProfile);
    setNewAvatarFile(null);
    setIsEditing(false);
    setErrors({});
  };

  if (isFetching) {
    return (
      <main className="min-h-screen bg-linear-to-br from-emerald-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-3 border-emerald-200 rounded-full"></div>
              <div className="w-16 h-16 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">
              Loading profile information...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50 rounded-full border border-emerald-100 mb-6">
            <Shield className="text-emerald-600" size={18} />
            <span className="text-sm font-medium text-emerald-700">
              Secure Profile
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Manage your professional profile, contact information, and account
            preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card - Left Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sticky top-8">
              <div className="flex flex-col items-center">
                {/* Avatar Section */}
                <div className="relative mb-8">
                  <div className="relative w-40 h-40">
                    <div className="absolute -inset-1 bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full opacity-20"></div>
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <img
                        src={profile.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=User";
                        }}
                      />
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors hover:scale-105 active:scale-95"
                        aria-label="Update profile photo"
                      >
                        <Camera size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  hidden
                />

                {/* User Info */}
                <div className="text-center w-full space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {profile.name}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Briefcase size={16} className="text-emerald-600" />
                      <span className="font-medium">{profile.jobTitle}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
                      <Building size={14} />
                      <span>{profile.department}</span>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="bg-linear-to-br from-emerald-50 to-white rounded-xl border border-emerald-100 p-5 w-full space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-emerald-100 rounded-lg">
                        <Mail size={16} className="text-emerald-700" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Email
                        </p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-emerald-100 rounded-lg">
                        <MapPin size={16} className="text-emerald-700" />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          Location
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {profile.location}
                        </p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-emerald-100">
                      <div className="flex items-center gap-2 text-xs text-emerald-600">
                        <Calendar size={12} />
                        <span>Member since {profile.memberSince}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section - Right Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Form Header */}
              <div className="border-b border-gray-100 px-8 py-6 bg-linear-to-r from-emerald-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Personal Information
                    </h3>
                    <p className="text-gray-600">
                      Update your professional details and contact information
                    </p>
                  </div>
                  <button
                    onClick={
                      isEditing ? handleCancel : () => setIsEditing(true)
                    }
                    className={`
                      inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
                      ${
                        isEditing
                          ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                          : "text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg"
                      }
                    `}
                  >
                    {isEditing ? (
                      <>
                        <X size={16} />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit size={16} />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status Messages */}
              <div className="px-8 pt-6">
                {success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-4 animate-in fade-in">
                    <div className="p-2.5 bg-emerald-100 rounded-lg">
                      <CheckCircle className="text-emerald-700" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900">
                        Profile updated successfully
                      </p>
                      <p className="text-sm text-emerald-700">
                        Your changes have been saved securely
                      </p>
                    </div>
                  </div>
                )}

                {errors.submit && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-4">
                    <div className="p-2.5 bg-rose-100 rounded-lg">
                      <XCircle className="text-rose-700" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-rose-900">
                        Unable to save changes
                      </p>
                      <p className="text-sm text-rose-700">{errors.submit}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <ProfileInputField
                    id="name"
                    label="Full Name"
                    value={profile.name}
                    Icon={User}
                    error={errors.name}
                    disabled={!isEditing}
                    description="Legal name"
                    handleChange={handleChange}
                  />
                  <ProfileInputField
                    id="email"
                    label="Email Address"
                    value={profile.email}
                    Icon={Mail}
                    type="email"
                    error={errors.email}
                    disabled={!isEditing}
                    description="Primary contact"
                    handleChange={handleChange}
                  />
                  <ProfileInputField
                    id="phone"
                    label="Phone Number"
                    value={profile.phone}
                    Icon={Phone}
                    type="tel"
                    error={errors.phone}
                    disabled={!isEditing}
                    description="Mobile preferred"
                    handleChange={handleChange}
                  />
                  <ProfileInputField
                    id="location"
                    label="Location"
                    value={profile.location}
                    Icon={MapPin}
                    error={errors.location}
                    disabled={!isEditing}
                    description="City & Country"
                    handleChange={handleChange}
                  />
                </div>

                {/* Form Footer */}
                {isEditing && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-3">
                        {hasUnsavedChanges ? (
                          <>
                            <div className="relative">
                              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                              <div className="w-3 h-3 bg-amber-500 rounded-full absolute top-0 animate-ping"></div>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Unsaved changes
                              </p>
                              <p className="text-xs text-gray-500">
                                Review and save your updates
                              </p>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle size={16} />
                            <span className="text-sm font-medium">
                              All changes saved
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !hasUnsavedChanges}
                        className={`
                          inline-flex items-center gap-3 px-8 py-3.5 bg-emerald-600 text-white rounded-xl
                          font-semibold transition-all hover:bg-emerald-700 hover:shadow-lg
                          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-600
                          min-w-[220px] justify-center
                        `}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Save size={18} />
                            Save All Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Security Notice */}
            <div className="mt-8 p-6 bg-linear-to-r from-emerald-50 to-emerald-50/30 rounded-2xl border border-emerald-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <Lock className="text-emerald-700" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Advanced Security & Privacy
                  </h4>
                  <p className="text-sm text-gray-600">
                    All personal information is encrypted end-to-end. Your data
                    is protected with enterprise-grade security protocols and
                    complies with global privacy standards including GDPR and
                    CCPA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Globe size={14} />
            <span>
              Last updated: {new Date().toLocaleDateString()} • v2.1.0
            </span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
