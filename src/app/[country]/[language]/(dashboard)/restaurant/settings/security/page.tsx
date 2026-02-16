import { SecurityTab } from "@/components/modules/restaurant/settings/tabs/SecurityTab";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Security</h1>
        <p className="text-sm text-gray-500">Manage your account security.</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <SecurityTab />
      </div>
    </div>
  );
}
