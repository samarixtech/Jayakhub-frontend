"use client";

import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: boolean;
  lastActive: string;
  avatar: string;
}

interface UsersTableProps {
  users: User[];
  isPending: boolean;
  onDelete: (id: string) => void;
}

export function UsersTable({ users, isPending, onDelete }: UsersTableProps) {
  const t = useTranslations("RestaurantDashboard.Users.table");
  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Table>
      <TableHeader className="bg-gray-50/50">
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="font-semibold text-gray-500 text-xs uppercase w-[300px] pl-6 pr-4">
            {t("colUser")}
          </TableHead>
          <TableHead className="font-semibold text-gray-500 text-xs uppercase px-4">
            {t("colRole")}
          </TableHead>
          <TableHead className="font-semibold text-gray-500 text-xs uppercase px-4 text-center">
            {t("colStatus")}
          </TableHead>
          <TableHead className="font-semibold text-gray-500 text-xs uppercase px-4">
            {t("colLastActive")}
          </TableHead>
          <TableHead className="font-semibold text-gray-500 text-xs uppercase text-right pl-4 pr-6">
            {t("colActions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isPending ? (
          // Skeleton Loader
          [...Array(5)].map((_, i) => (
            <TableRow key={i} className="animate-pulse">
              <TableCell className="py-4 pl-6 pr-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-100 rounded" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </TableCell>
              <TableCell className="px-4 text-center">
                <div className="h-5 w-10 bg-gray-200 rounded-full mx-auto" />
              </TableCell>
              <TableCell className="px-4">
                <div className="h-4 w-24 bg-gray-100 rounded" />
              </TableCell>
              <TableCell className="text-right pl-4 pr-6">
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                  <div className="h-8 w-8 bg-gray-100 rounded-lg" />
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : users.length === 0 ? (
          // Empty State
          <TableRow>
            <TableCell colSpan={5} className="h-32 text-center text-gray-500">
              {t("noUsers")}
            </TableCell>
          </TableRow>
        ) : (
          // User List
          (users || []).map((user) => (
            <TableRow
              key={user.id}
              className="border-gray-50 hover:bg-gray-50/50 group"
            >
              {/* User Column */}
              <TableCell className="py-4 pl-6 pr-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-gray-100 bg-gray-50 text-gray-500">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="font-medium text-gray-600 text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Typography className="font-semibold text-gray-900 text-sm">
                      {user.name}
                    </Typography>
                    <Typography className="text-gray-400 text-xs">
                      {user.email}
                    </Typography>
                  </div>
                </div>
              </TableCell>

              {/* Role Column */}
              <TableCell className="px-4">
                <span className="font-bold text-xs text-gray-900 uppercase tracking-wide">
                  {user.role}
                </span>
              </TableCell>

              {/* Status Column */}
              <TableCell className="px-4 text-center">
                <div className="flex justify-center">
                  <Switch
                    checked={user.status}
                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-gray-200"
                  />
                </div>
              </TableCell>

              {/* Last Active Column */}
              <TableCell className="px-4">
                <span className="text-sm text-gray-500">{user.lastActive}</span>
              </TableCell>

              {/* Actions Column */}
              <TableCell className="text-right pl-4 pr-6">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/restaurant/users/${user.id}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(user.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
