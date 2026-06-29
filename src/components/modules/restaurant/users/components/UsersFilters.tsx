"use client";

import Link from "next/link";
import { Plus, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { usePlanAccess } from "@/hooks/use-plan-access";

interface FilterOption {
  label: string;
  value: string;
  count: number;
}

interface UsersFiltersProps {
  filters: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  totalUsers: number;
}

export function UsersFilters({
  filters,
  selectedFilter,
  onFilterChange,
  totalUsers,
}: UsersFiltersProps) {
  const t = useTranslations("RestaurantDashboard.Users.filters");
  const { hasKeyword } = usePlanAccess();

  const staffLimit = hasKeyword("multi_role_unlimited")
    ? Infinity
    : hasKeyword("multi_role_5_staff")
      ? 5
      : hasKeyword("multi_role_2_staff")
        ? 2
        : 0;
  const canAddUser = totalUsers < staffLimit;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Filters (Pills) */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scrollbar w-full sm:w-auto">
        {(filters || []).map((filter) => (
          <Button
            key={filter.value}
            variant="outline"
            onClick={() => onFilterChange(filter.value)}
            className={`
                rounded-full px-4 h-9 border
                ${
                  selectedFilter === filter.value
                    ? "bg-[#1F4D36] text-white border-[#1F4D36] hover:bg-[#183d2b] hover:text-white"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }
              `}
          >
            {filter.label}
            <Badge
              variant="secondary"
              className={`
                  ml-2 px-1.5 py-0 text-[10px] h-5 min-w-[20px] flex items-center justify-center rounded-full
                  ${
                    selectedFilter === filter.value
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-500"
                  }
                `}
            >
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Actions (Bell + Add User) */}
      <div className="flex items-center gap-4 shrink-0">
        <Button variant="ghost" size="icon" className="text-gray-500">
          <Bell className="w-5 h-5" />
        </Button>
        {canAddUser && (
          <Link href="/restaurant/users/new">
            <Button className="bg-[#1F4D36] hover:bg-[#183d2b] text-white gap-2">
              <Plus className="w-4 h-4" />
              {t("addUser")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
