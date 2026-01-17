"use client";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Shield,
  Key,
  UserCheck,
  ArrowLeft,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Type definitions
interface FormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  submit?: string;
}

interface SecurityFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

// Define the primary and secondary theme colors for Tailwind
// Primary: #0B5D4E (Dark Green/Teal)
// Secondary: #E8F4F1 (Light Green/Teal Background/Card)
// Border: #FFF9EE (Light Off-White) - Changed to a slightly visible border color

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<boolean>(false);

  // Password strength criteria
  const passwordCriteria: PasswordCriteria = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!allCriteriaMet) {
      newErrors.newPassword = "Password does not meet all requirements";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful password change
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setErrors({ submit: "Failed to change password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const securityFeatures: SecurityFeature[] = [
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Protect your account with a strong, unique password",
    },
    {
      icon: Key,
      title: "Regular Updates",
      description: "Update your password periodically for better security",
    },
    {
      icon: UserCheck,
      title: "Account Protection",
      description: "Keep your personal information and orders secure",
    },
  ];

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
  };

  const passwordRequirements = [
    { key: "length" as keyof PasswordCriteria, label: "At least 8 characters" },
    {
      key: "uppercase" as keyof PasswordCriteria,
      label: "One uppercase letter",
    },
    {
      key: "lowercase" as keyof PasswordCriteria,
      label: "One lowercase letter",
    },
    { key: "number" as keyof PasswordCriteria, label: "One number" },
    {
      key: "special" as keyof PasswordCriteria,
      label: "One special character",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8" aria-labelledby="page-title">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center space-y-6">
          <div className="space-y-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-[#0B5D4E] transition-colors mb-4 mx-auto"
            >
              <ArrowLeft size={20} />
              Back to Settings
            </button>
            <h1
              id="page-title"
              className="text-2xl font-semibold text-gray-900"
            >
              Change Password
            </h1>
            <p className="text-gray-600">
              Secure your account with a new password
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Security Features */}
          <section
            aria-labelledby="security-features-heading"
            className="lg:col-span-1"
          >
            <div className="bg-[#E8F4F1] rounded-xl border border-gray-200 p-6 space-y-6">
              <h2
                id="security-features-heading"
                className="text-lg font-semibold text-gray-900"
              >
                Password Security
              </h2>

              <div className="space-y-4">
                {securityFeatures.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      {/* Fixed icon background and text color to white */}
                      <div className="p-2 bg-[#0B5D4E] rounded-lg text-white mt-1">
                        <FeatureIcon size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-xs mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-medium text-amber-800 text-sm mb-2">
                  Password Tips
                </h3>
                <ul className="text-amber-700 text-xs space-y-1">
                  <li>• Use a mix of letters, numbers, and symbols</li>
                  <li>• Avoid common words or personal information</li>
                  <li>• Don't reuse passwords across different sites</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Change Password Form */}
          <section
            aria-labelledby="change-password-heading"
            className="lg:col-span-2"
          >
            <div className="bg-[#E8F4F1] rounded-xl border border-gray-200 p-6">
              <h2
                id="change-password-heading"
                className="text-lg font-semibold text-gray-900 mb-6"
              >
                Update Your Password
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={20} />
                  <div>
                    <div className="font-medium text-green-800">
                      Password Updated Successfully
                    </div>
                    <div className="text-green-700 text-sm">
                      Your password has been changed securely
                    </div>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <XCircle className="text-red-600" size={20} />
                  <div className="text-red-800 text-sm">{errors.submit}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    {/* Input icon color fix */}
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={handleCurrentPasswordChange}
                      // Input styling fix: text-gray-900, placeholder-gray-500, focus:ring-[#0B5D4E], border-gray-300
                      className={`w-full pl-10 pr-10 py-3 bg-white text-gray-900 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] ${
                        errors.currentPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your current password"
                    />
                    {/* Toggle button color fix */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    {/* Input icon color fix */}
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      // Input styling fix: text-gray-900, placeholder-gray-500, focus:ring-[#0B5D4E], border-gray-300
                      className={`w-full pl-10 pr-10 py-3 bg-white text-gray-900 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] ${
                        errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Create a new password"
                    />
                    {/* Toggle button color fix */}
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Criteria */}
                  {newPassword && (
                    // Background color fix
                    <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Password Requirements
                      </h4>
                      <div className="space-y-2">
                        {passwordRequirements.map((requirement) => (
                          <div
                            key={requirement.key}
                            className="flex items-center gap-3"
                          >
                            {passwordCriteria[requirement.key] ? (
                              <CheckCircle
                                className="text-green-600"
                                size={16}
                              />
                            ) : (
                              <XCircle className="text-gray-400" size={16} />
                            )}
                            <span
                              className={`text-sm ${
                                passwordCriteria[requirement.key]
                                  ? "text-green-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {requirement.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    {/* Input icon color fix */}
                    <Lock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      // Input styling fix: text-gray-900, placeholder-gray-500, focus:ring-[#0B5D4E], border-gray-300
                      className={`w-full pl-10 pr-10 py-3 bg-white text-gray-900 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5D4E] focus:border-[#0B5D4E] ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm your new password"
                    />
                    {/* Toggle button color fix */}
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    // Cancel button styling fix: bg-white, text-gray-700, border-gray-300, hover:bg-gray-100
                    className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 font-medium flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !allCriteriaMet ||
                      !currentPassword ||
                      !confirmPassword
                    }
                    // Primary button styling is fine, ensuring text color is light
                    className="px-6 py-3 bg-[#0B5D4E] text-white rounded-lg hover:bg-[#08483d] transition-colors font-medium flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        {/* Spinner color is fine */}
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>

        {/* Additional Security Info */}
        <section aria-labelledby="security-info-heading">
          {/* Card styling fix: border-gray-200, bg-[#E8F4F1] is kept */}
          <div className="bg-[#E8F4F1] rounded-xl border border-gray-200 p-6">
            <h2
              id="security-info-heading"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Account Security
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Best Practices</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="text-green-600 mt-0.5 shrink-0"
                      size={16}
                    />
                    <span>
                      Use a password manager to generate and store strong
                      passwords
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="text-green-600 mt-0.5 shrink-0"
                      size={16}
                    />
                    <span>
                      Enable two-factor authentication for extra security
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle
                      className="text-green-600 mt-0.5 shrink-0"
                      size={16}
                    />
                    <span>Change your password every 3-6 months</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Need Help?</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    {/* Bullet color fix */}
                    <span className="text-[#0B5D4E] font-medium">•</span>
                    <span>
                      Forgot your password? Use the password reset feature on
                      the login page
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {/* Bullet color fix */}
                    <span className="text-[#0B5D4E] font-medium">•</span>
                    <span>
                      Contact support if you suspect unauthorized account access
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {/* Bullet color fix */}
                    <span className="text-[#0B5D4E] font-medium">•</span>
                    <span>
                      Review recent login activity in your account settings
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
