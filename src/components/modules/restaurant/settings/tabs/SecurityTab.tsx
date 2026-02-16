import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecurityTab() {
  return (
    <div className="p-6">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-lg font-bold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Update your password securely.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Current Password <span className="text-red-500">*</span>
          </Label>
          <Input
            type="password"
            placeholder="••••••••"
            className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="New Password"
              className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-1.5 block">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            <Input
              type="password"
              placeholder="Confirm New Password"
              className="h-11 border-gray-200 focus-visible:ring-primary/20 focus-visible:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button className="bg-primary hover:bg-primary/90">
          Update Password
        </Button>
      </div>
    </div>
  );
}
