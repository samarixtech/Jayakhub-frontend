"use client";
import { useState } from "react";
import {
  Check,
  User,
  Phone,
  Store,
  MapPin,
  Utensils,
  Clock,
  Plus,
  Image as ImageIcon,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { id: 1, label: "Owner Info", icon: User },
  { id: 2, label: "Restaurant", icon: Store },
  { id: 3, label: "Schedule", icon: Clock },
  { id: 4, label: "Menu", icon: ChefHat },
];

export default function RestaurantOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6   flex flex-col ">
      <div className="w-full max-w-full mb-8">
        <Typography variant="h2" className="text-2xl font-black text-[#111827]">
          Complete Profile
        </Typography>
        <Typography className="text-gray-500 text-sm mt-1">
          Please finish setting up your restaurant to start accepting orders.
        </Typography>
      </div>

      <Card className="w-full max-w-full border-none shadow-sm rounded-[40px] bg-white overflow-hidden p-12">
        {/* Stepper Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="h-16 w-16 bg-[#346853] rounded-2xl flex items-center justify-center mb-4">
            <Utensils className="text-white h-8 w-8" />
          </div>
          <Typography variant="h3" className="text-xl font-black">
            Complete Your Profile
          </Typography>
          <Typography className="text-gray-400 text-xs font-medium mt-1">
            Let&apos;s get your restaurant set up on JayakHub
          </Typography>
        </div>

        {/* Stepper Progress Bar */}
        <div className="relative flex justify-between w-full mb-16 px-10">
          <div className="absolute top-4 left-20 right-20 h-px bg-emerald-100 z-0" />
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= step.id
                    ? "bg-[#346853] text-white"
                    : "bg-white border border-emerald-100 text-gray-300"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  currentStep >= step.id ? "text-[#346853]" : "text-gray-300"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <CardContent className="p-0">
          {/* STEP 1: OWNER INFO */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Typography className="font-bold text-gray-900">
                Who manages this restaurant?
              </Typography>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl"
                      placeholder="+964 000 000 0000"
                    />
                  </div>
                  <Typography className="text-[10px] text-gray-400">
                    We will send important updates to this number.
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: RESTAURANT INFO */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Typography className="font-bold text-gray-900">
                Tell us about your place
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Restaurant Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Cuisine Type
                  </label>
                  <Select>
                    <SelectTrigger className="h-12 bg-gray-50/50 border-gray-100 rounded-xl">
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fastfood">Fast Food</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Full Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3 h-4 w-4 text-gray-400" />
                    <Input className="pl-12 h-12 bg-gray-50/50 border-gray-100 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400">
                    Restaurant Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer">
                    <ImageIcon className="h-6 w-6 text-gray-300 mb-2" />
                    <span className="text-xs font-bold text-gray-500">
                      Click to upload Logo
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Square image recommended
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <Typography className="font-bold text-gray-900">
                Operating Hours
              </Typography>
              <div className="space-y-3">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-2xl"
                  >
                    <span className="text-sm font-bold text-gray-700 w-24">
                      {day}
                    </span>
                    <div className="flex items-center gap-3">
                      <Input
                        className="w-24 h-9 bg-gray-50/50 text-center text-xs border-none"
                        defaultValue="09:00 AM"
                      />
                      <span className="text-xs text-gray-400 font-bold">
                        to
                      </span>
                      <Input
                        className="w-24 h-9 bg-gray-50/50 text-center text-xs border-none"
                        defaultValue="11:00 PM"
                      />
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: MENU */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <Typography className="font-bold text-gray-900">
                  Build Your Menu
                </Typography>
                <Badge className="bg-emerald-50 text-[#346853] hover:bg-emerald-50 border-none px-3 py-1 rounded-full text-[10px]">
                  0 Items Added
                </Badge>
              </div>
              <div className="border border-gray-50 rounded-3xl p-6 space-y-4">
                <Typography className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Add New Item
                </Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Item Name
                    </label>
                    <Input className="h-10 bg-gray-50/50 border-gray-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      Price ($)
                    </label>
                    <Input className="h-10 bg-gray-50/50 border-gray-100" />
                  </div>
                </div>
                <div className="flex items-center space-x-2 py-2">
                  <Checkbox id="special" />
                  <label
                    htmlFor="special"
                    className="text-xs font-bold text-gray-500"
                  >
                    Mark as Special/Deal
                  </label>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-dashed border-2 border-emerald-100 text-[#346853] h-12 rounded-xl hover:bg-emerald-50 font-bold"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Item to Menu
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-50 pt-8">
            {currentStep > 1 ? (
              <Button
                onClick={prevStep}
                variant="ghost"
                className="text-gray-400 font-bold hover:bg-transparent"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-4 items-center">
              {currentStep === 4 && (
                <Button
                  variant="ghost"
                  className="text-gray-400 text-xs font-bold"
                >
                  Skip for now
                </Button>
              )}
              <Button
                onClick={nextStep}
                className="bg-[#346853] text-white px-10 h-12 rounded-2xl font-bold hover:bg-[#2a5443] shadow-md shadow-emerald-900/10"
              >
                {currentStep === 4 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
