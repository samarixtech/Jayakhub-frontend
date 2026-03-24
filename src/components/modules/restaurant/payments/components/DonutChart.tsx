import React from "react";
import { useTranslations } from "next-intl";

const DonutChart = ({ pcts, colors, totalValue }: { pcts: number[], colors: string[], totalValue: string }) => {
    const t = useTranslations("RestaurantDashboard.Payments.paymentMethods");
    const radius = 70;
    const cx = 90;
    const cy = 90;
    const stroke = 22;
    const circ = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <svg viewBox="0 0 180 180" className="w-[160px] h-[160px]">
            {pcts.map((pct, i) => {
                const dash = (pct / 100) * circ;
                const gap = circ - dash;
                const seg = (
                    <circle key={i} cx={cx} cy={cy} r={radius} fill="none" stroke={colors[i]} strokeWidth={stroke}
                        strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset}
                        transform={`rotate(-90 ${cx} ${cy})`}
                    />
                );
                offset += dash;
                return seg;
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#1a1a1a" fontSize="18" fontWeight="900">{totalValue}</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#a0a0a0" fontSize="9" fontWeight="600">{t("total")}</text>
        </svg>
    );
};

export default DonutChart;
