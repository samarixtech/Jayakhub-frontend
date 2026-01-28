import { Save, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

interface ProfileHeaderProps {
  isPending: boolean;
  onSave: () => void;
  onCancel: () => void;
  showCancel: boolean;
  saveDisabled: boolean;
}

export default function ProfileHeader({
  isPending,
  onSave,
  onCancel,
  showCancel,
  saveDisabled,
}: ProfileHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <Typography variant="h2" className="text-[#111827] font-bold text-2xl">
          My Profile
        </Typography>
        <Typography variant="small" className="text-gray-500">
          Manage your profile settings
        </Typography>
      </div>
      <div className="flex gap-3">
        {/* Only show Cancel if changes are detected */}
        {showCancel && (
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-full border-gray-200 bg-white text-gray-700 h-11 px-6 flex gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}

        <Button
          onClick={onSave}
          disabled={isPending || saveDisabled} // DISABLED IF PENDING OR NO CHANGES IN PROFILE
          className={`rounded-full h-11 px-6 shadow-sm text-white ${
            saveDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-emerald-bg hover:bg-emerald-700"
          }`}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </header>
  );
}
