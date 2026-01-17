"use client";

import { useState } from "react";
import {
  User,
  Shield,
  CreditCard,
  Lock,
  LogOut,
  Save,
  Trash2,
  Upload,
  Edit,
  X,
  CheckCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

// TYPE INTERFACES
interface IMenu {
  icon: React.ElementType;
  title?: string;
  isSelected?: boolean;
  onClick: () => void;
}

interface ISecCards {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface Iinput {
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}

interface IButton {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
}

// UTILITY COMPONENTS
const SettingsMenuItem = ({
  icon: Icon,
  title,
  isSelected,
  onClick,
}: IMenu) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gray-900 text-[#E8F4F1] font-medium"
          : "text-gray-600 hover:bg-[#FFF9EE] hover:text-gray-900"
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="text-sm">{title}</span>
    </div>
  );
};

const SettingsSectionCard = ({ children, title, subtitle }: ISecCards) => (
  <div className="bg-[#E8F4F1] p-6 rounded-xl border border-[#FFF9EE]">
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    {children}
  </div>
);

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  readOnly = true,
}: Iinput) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
    />
  </div>
);

const PrimaryButton = ({ children, onClick, icon: Icon = Save }: IButton) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 bg-gradient-to-r from-[#0B5D4E] to-[#013a63] text-[#E8F4F1] text-sm font-medium rounded-lg hover:bg-gradient-to-r hover:from-[#013a63] hover:to-[#0B5D4E] transition-colors duration-200"
  >
    <Icon className="w-4 h-4 mr-2" />
    {children}
  </button>
);

const DangerButton = ({ children, onClick, icon: Icon = Trash2 }: IButton) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 bg-red-600 text-[#E8F4F1] text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
  >
    <Icon className="w-4 h-4 mr-2" />
    {children}
  </button>
);

// Settings Page Sections
const ProfileSettings = ({ t }: { t: (key: string) => string }) => (
  <SettingsSectionCard
    title={t("profile.title")}
    subtitle={t("profile.subtitle")}
  >
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full bg-[#FFF9EE] flex items-center justify-center border-2 border-gray-300">
          <span className="text-gray-600 text-lg font-medium">JD</span>
        </div>
        <div>
          <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4 mr-2" />
            {t("profile.upload_photo")}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            {t("profile.upload_info")}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <InputField label={t("profile.label_name")} value="John Doe" />
        <InputField
          label={t("profile.label_email")}
          type="email"
          value="john.doe@example.com"
        />
      </div>

      <InputField label={t("profile.label_location")} value="New York, USA" />

      <div className="pt-4 border-t border-[#FFF9EE]">
        <PrimaryButton>{t("profile.button_save")}</PrimaryButton>
      </div>
    </div>
  </SettingsSectionCard>
);

const SecuritySettings = ({ t }: { t: (key: string) => string }) => (
  <SettingsSectionCard
    title={t("security.title")}
    subtitle={t("security.subtitle")}
  >
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {t("security.password_header")}
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <InputField
            label={t("security.label_current_pw")}
            type="password"
            placeholder="********"
          />
          <InputField
            label={t("security.label_new_pw")}
            type="password"
            placeholder="********"
          />
          <InputField
            label={t("security.label_confirm_pw")}
            type="password"
            placeholder="********"
          />
        </div>
      </div>

      <div className="pt-2">
        <PrimaryButton icon={Lock}>
          {t("security.button_update_pw")}
        </PrimaryButton>
      </div>

      <div className="border-t border-[#FFF9EE] pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {t("security.two_factor_header")}
        </h4>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-gray-50 border border-[#FFF9EE]">
          <p className="text-gray-700 flex items-center text-sm mb-3 sm:mb-0">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            {t("security.two_factor_status")}
          </p>
          <button className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:bg-[#E8F4F1] transition-colors">
            {t("security.button_manage_2fa")}
          </button>
        </div>
      </div>
    </div>
  </SettingsSectionCard>
);

const BillingSettings = ({ t }: { t: (key: string) => string }) => (
  <SettingsSectionCard
    title={t("billing.title")}
    subtitle={t("billing.subtitle")}
  >
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {t("billing.subscription_header")}
        </h4>
        <div className="p-4 rounded-lg bg-gray-50 border border-[#FFF9EE]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="font-medium text-gray-900">
                {t("billing.pro_plan")}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {t("billing.plan_cost")}
              </p>
            </div>
            <button className="mt-3 sm:mt-0 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-300 hover:bg-[#E8F4F1] transition-colors">
              {t("billing.button_change_plan")}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#FFF9EE] pt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">
          {t("billing.payment_method_header")}
        </h4>
        <div className="p-4 rounded-lg bg-gray-50 border border-[#FFF9EE]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p className="text-sm text-gray-700 mb-3 sm:mb-0">
              <CreditCard className="w-4 h-4 mr-2 inline" />
              Visa ending in 4242
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm text-gray-700 rounded border border-gray-300 hover:bg-[#E8F4F1] transition-colors">
                <Edit className="w-3 h-3 mr-1 inline" />
                {t("billing.button_edit")}
              </button>
              <button className="px-3 py-1 text-sm text-red-600 rounded border border-red-200 hover:bg-red-50 transition-colors">
                <X className="w-3 h-3 mr-1 inline" />
                {t("billing.button_remove")}
              </button>
            </div>
          </div>
        </div>
        <button className="flex items-center mt-4 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          <CreditCard className="w-4 h-4 mr-2" />
          {t("billing.button_add_new")}
        </button>
      </div>
    </div>
  </SettingsSectionCard>
);

const SettingsPage = () => {
  const t = useTranslations("settings");
  const [activeSection, setActiveSection] = useState("profile");

  const navItems = [
    { id: "profile", icon: User, label: t("navigation.profile") },
    { id: "security", icon: Shield, label: t("navigation.security") },
    { id: "billing", icon: CreditCard, label: t("navigation.billing") },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings t={t} />;
      case "security":
        return <SecuritySettings t={t} />;
      case "billing":
        return <BillingSettings t={t} />;
      default:
        return <ProfileSettings t={t} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("header")}</h1>
          <p className="text-gray-600 mt-1">{t("subheader")}</p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <nav className="lg:w-64 p-4 bg-[#E8F4F1] rounded-lg border border-[#FFF9EE] h-fit lg:sticky lg:top-8">
            <div className="space-y-1">
              {navItems.map((item) => (
                <SettingsMenuItem
                  key={item.id}
                  icon={item.icon}
                  title={item.label}
                  isSelected={activeSection === item.id}
                  onClick={() => setActiveSection(item.id)}
                />
              ))}
            </div>

            {/* Logout */}
            <div className="mt-6 pt-4 border-t border-[#FFF9EE]">
              <div className="flex items-center p-3 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
                <LogOut className="w-4 h-4 mr-3" />
                <span>{t("navigation.logout")}</span>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {renderSection()}

            {/* Danger Zone */}
            <SettingsSectionCard
              title={t("danger_zone.title")}
              subtitle={t("danger_zone.subtitle")}
            >
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-3 sm:mb-0">
                    <h4 className="font-medium text-red-800 mb-1">
                      {t("danger_zone.delete_header")}
                    </h4>
                    <p className="text-sm text-red-700">
                      {t("danger_zone.delete_info")}
                    </p>
                  </div>
                  <DangerButton>{t("danger_zone.button_delete")}</DangerButton>
                </div>
              </div>
            </SettingsSectionCard>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
