import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LanguageSwitcher from "../../../common/LanguageSwitcher";
import UserProfile from "../../../common/UserProfile";

import { HeaderActionsProps } from "@/components/modules/discovery/discovery.types";

export const HeaderActions = ({
  isLoggedIn,
  user,
  totalItems,
  onLogout,
  onCartClick,
}: HeaderActionsProps) => {
  return (
    <div className="flex items-center gap-2 md:gap-3 shrink-0">
      {/* Language */}
      <LanguageSwitcher />

      {/* Auth Section */}
      {!isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-white text-sm font-medium hover:text-white/80 transition-colors hidden md:inline"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white text-emerald-bg text-sm font-semibold border border-emerald-bg rounded-full px-4 py-1.5 hover:bg-white/90 transition-colors hidden md:inline-block"
          >
            Sign up
          </Link>
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white font-bold text-sm leading-none">
              {user?.name || "User"}
            </p>
            <p className="text-white/70 text-[10px] uppercase tracking-widest font-medium mt-1">
              {typeof user?.role === "string"
                ? user.role.replace(/_/g, " ")
                : user?.role?.name || "NULL"}
            </p>
          </div>
          <UserProfile user={user} onLogout={onLogout} />
        </div>
      )}

      {/* Cart */}
      <div className="relative hidden md:block">
        <Button
          onClick={onCartClick}
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-white hover:bg-white/10 rounded-full"
        >
          <FiShoppingBag className="w-6 h-6" />
        </Button>
        {totalItems > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full bg-red-500 text-white pointer-events-none border-2 border-[#346853]">
            {totalItems > 9 ? "9+" : totalItems}
          </Badge>
        )}
      </div>
    </div>
  );
};
