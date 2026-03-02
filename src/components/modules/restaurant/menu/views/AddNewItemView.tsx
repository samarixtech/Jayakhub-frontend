"use client";

import { ChevronLeft, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { useAddNewItem } from "../hooks/useAddNewItem";
import { ItemBasicInfo } from "../components/ItemBasicInfo";
import { ItemImageUpload } from "../components/ItemImageUpload";
import { ItemVariantGroupsSelection } from "../components/ItemVariantGroupsSelection";
import { ItemLivePreview } from "../components/ItemLivePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  if (isFetchingItem) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Typography>Loading item details...</Typography>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 mb-20 animate-in fade-in duration-500">
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/restaurant/menu/items")}
              className="rounded-full hover:bg-white shadow-sm"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </Button>
            <div>
              <Typography
                variant="h2"
                className="text-2xl font-black text-gray-900"
              >
                {isEditMode ? "Edit Menu Item" : "Create New Item"}
              </Typography>
              <div className="flex items-center gap-2 text-gray-400 mt-1">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Menu Management
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-bg">
                  {isEditMode ? "Updating" : "New Entry"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/restaurant/menu/items")}
              className="text-gray-500 font-bold hover:text-gray-900"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-bg hover:bg-emerald-bg-hover text-white font-black px-8 py-6 rounded-2xl shadow-lg shadow-emerald-bg/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSaving
                ? "Processing..."
                : isEditMode
                  ? "Update Selection"
                  : "Save Item"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-4xl p-6 shadow-sm border border-gray-50">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="bg-gray-50/50 p-1 rounded-2xl mb-8 border border-gray-100 w-full md:w-auto h-auto grid grid-cols-2 md:inline-flex">
                  <TabsTrigger
                    value="basic"
                    className="flex-1 md:flex-none py-3 px-8 rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-bg data-[state=active]:shadow-sm outline-none"
                  >
                    <Info className="w-4 h-4 mr-2" />
                    General Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="variants"
                    className="flex-1 md:flex-none py-3 px-8 rounded-xl font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-bg data-[state=active]:shadow-sm outline-none"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Variants & Options
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="basic"
                  className="space-y-8 animate-in slide-in-from-left-4 duration-300"
                >
                  <ItemBasicInfo
                    formData={formData}
                    categories={categories}
                    onChange={handleInputChange}
                  />

                  <div className="h-px bg-gray-100" />

                  <ItemImageUpload
                    imagePreview={imagePreview}
                    onImageChange={handleImageChange}
                  />
                </TabsContent>

                <TabsContent
                  value="variants"
                  className="space-y-6 animate-in slide-in-from-right-4 duration-300"
                >
                  <ItemVariantGroupsSelection
                    variantGroups={variantGroups}
                    selectedGroups={formData.variantGroups}
                    onToggle={toggleVariantGroup}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sidebar / Preview */}
          <div className="lg:col-span-4">
            <ItemLivePreview formData={formData} imagePreview={imagePreview} />
          </div>
        </div>
      </form>
    </div>
  );
}
