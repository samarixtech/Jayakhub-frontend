"use client";

import { useTranslations } from "next-intl";
import { useAddNewItem } from "../hooks/useAddNewItem";
import { ItemBasicInfo } from "../components/ItemBasicInfo";
import { ItemImageUpload } from "../components/ItemImageUpload";
import { ItemVariantGroupsSelection } from "../components/ItemVariantGroupsSelection";
import { ItemLivePreview } from "../components/ItemLivePreview";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Plus } from "lucide-react";

export default function AddNewItemView() {
  const {
    formData,
    isEditMode,
    categories,
    variantGroups,
    imagePreview,
    isFetchingItem,
    isSaving,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    toggleVariantGroup,
    router,
  } = useAddNewItem();

  const t = useTranslations("RestaurantDashboard.Menu.Items.views");

  if (isFetchingItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Typography className="font-bold text-gray-400">
          {t("loadingDetails")}
        </Typography>
      </div>
    );
  }


  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-4 pb-32 animate-in fade-in duration-700">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            <ItemBasicInfo
              formData={formData}
              categories={categories}
              onChange={handleInputChange}
            />

            <ItemImageUpload
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
            />

            <ItemVariantGroupsSelection
              variantGroups={variantGroups}
              selectedGroups={formData.variantGroups}
              onToggle={toggleVariantGroup}
            />
          </div>

          {/* Sidebar / Preview */}
          <div className="lg:col-span-4 sticky top-10">
            <ItemLivePreview formData={formData} imagePreview={imagePreview} />
          </div>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-center md:justify-start gap-4">
          <div className="max-w-[1400px] w-full flex items-center justify-start gap-3 px-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/restaurant/menu/items")}
              className="bg-gray-100/50 hover:bg-gray-100 text-gray-600 font-bold h-14 px-8 rounded-2xl transition-all"
            >
              {t("discardBtn")}
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#2D5A43] hover:bg-[#234735] text-white font-black h-14 px-12 rounded-2xl shadow-xl shadow-emerald-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              {isSaving ? (
                t("processing")
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  {isEditMode ? t("saveChangesBtn") : t("saveBtn")}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
