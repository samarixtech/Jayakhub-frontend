import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";

interface AddCategoryCardProps {
  isCreating: boolean;
  setIsCreating: (v: boolean) => void;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const AddCategoryCard: React.FC<AddCategoryCardProps> = ({
  isCreating,
  setIsCreating,
  newCategoryName,
  setNewCategoryName,
  onConfirm,
  onCancel,
  isSaving,
}) => {
  if (!isCreating) {
    return (
      <Button
        onClick={() => setIsCreating(true)}
        variant="outline"
        className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-[#1F4D36] group transition-all"
      >
        <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#1F4D36] group-hover:scale-110 transition-transform">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-gray-500 font-medium group-hover:text-[#1F4D36]">
          Create New Category
        </span>
      </Button>
    );
  }

  return (
    <div className="w-full border-2 border-dashed border-[#1F4D36] rounded-2xl p-6 bg-gray-50 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        <Typography className="font-semibold text-center text-gray-700">
          Add New Category
        </Typography>
        <Input
          placeholder="e.g. Appetizers"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="bg-white"
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
          autoFocus
        />
        <div className="flex gap-2 justify-center">
          <Button
            onClick={onConfirm}
            disabled={isSaving || !newCategoryName}
            className="bg-[#1F4D36] text-white"
          >
            {isSaving ? "Saving..." : "Create Category"}
          </Button>
          <Button variant="ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
