import React from "react";

const StatCard = ({ label, value, trend, icon, iconBg }: {
    label: string; value: string; trend: string; icon: React.ReactNode; iconBg: string;
}) => (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-start">
            <span className="text-[13px] font-medium text-gray-500">{label}</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
        </div>
        <span className="text-[28px] font-black text-[#1a1a1a] leading-tight">{value}</span>
        <span className="text-[12px] font-semibold text-emerald-600">{trend}</span>
    </div>
);

export default StatCard;
