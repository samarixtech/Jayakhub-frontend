import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface RiderCardProps {
  riderName?: string;
  vehicleInfo?: string;
  rating?: number;
  avatarUrl?: string;
}

export const RiderCard: React.FC<RiderCardProps> = ({
  riderName = "Arjun K.",
  vehicleInfo = "Honda Vario • B 1234 JKH",
  rating = 4.9,
  avatarUrl = "https://avatar.vercel.sh/rider",
}) => {
  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Your Rider
        </h3>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-900">{rating}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden relative">
          <Image
            src={avatarUrl}
            alt="Rider"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 text-lg leading-tight">
            {riderName}
          </h4>
          <p className="text-sm text-gray-500">{vehicleInfo}</p>
        </div>
      </div>
    </div>
  );
};
