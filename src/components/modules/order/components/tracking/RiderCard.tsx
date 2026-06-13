import React from "react";
import Image from "next/image";
import { Star, Phone, Clock, Bike } from "lucide-react";

interface Rider {
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  rating: number;
  estimatedArrivalTime?: string;
}

interface RiderCardProps {
  rider?: Rider | null;
}

export const RiderCard: React.FC<RiderCardProps> = ({ rider }) => {
  if (!rider) {
    return (
      <div className="border border-gray-100 rounded-2xl p-6 bg-white">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
          Your Rider
        </h3>
        <p className="text-sm text-gray-400">Rider not assigned yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Your Rider
        </h3>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-900">{rider.rating}</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden relative shrink-0">
          <Image
            src={`https://avatar.vercel.sh/${rider.name}`}
            alt={rider.name}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-base leading-tight truncate">
            {rider.name}
          </h4>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
            <Bike className="w-3.5 h-3.5 shrink-0" />
            <span className="capitalize">{rider.vehicleType}</span>
            <span className="text-gray-300">•</span>
            <span>{rider.vehicleNumber}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {rider.estimatedArrivalTime && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#346853]" />
            <span>ETA <span className="font-bold text-gray-900">{rider.estimatedArrivalTime}</span></span>
          </div>
        )}
        <a
          href={`tel:${rider.phone}`}
          className="flex items-center gap-1.5 text-xs text-[#346853] font-bold bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Call Rider
        </a>
      </div>
    </div>
  );
};
