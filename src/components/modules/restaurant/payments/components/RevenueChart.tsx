import React from "react";

const RevenueChart = ({ points, prevPoints }: { points: number[], prevPoints: number[] }) => {
    const maxY = 600;
    const w = 560;
    const h = 200;

    const labels = ["Jan 29", "Feb 1", "Feb 5", "Feb 9", "Feb 13", "Feb 17", "Feb 21"];
    const yLabels = ["$1700", "$1200", "$700", "$475", "$238", "$0"];

    return (
        <div className="relative">
            <svg viewBox={`0 0 ${w + 40} ${h + 30}`} className="w-full h-auto">
                {/* Y grid lines */}
                {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line key={i} x1={40} y1={i * (h / 5)} x2={w + 40} y2={i * (h / 5)} stroke="#f0f0f0" strokeWidth="1" />
                ))}
                {/* Y labels */}
                {yLabels.map((l, i) => (
                    <text key={i} x={0} y={i * (h / 5) + 4} fill="#a0a0a0" fontSize="9" fontWeight="600">{l}</text>
                ))}
                {/* X labels */}
                {labels.map((l, i) => (
                    <text key={i} x={40 + i * (w / (labels.length - 1))} y={h + 20} fill="#a0a0a0" fontSize="9" fontWeight="600" textAnchor="middle">{l}</text>
                ))}
                {/* Previous period (dashed) */}
                <polyline
                    points={prevPoints.map((p, i) => `${40 + (i / Math.max(1, prevPoints.length - 1)) * w},${h - (p / maxY) * h}`).join(" ")}
                    fill="none" stroke="#d0d0d0" strokeWidth="1.5" strokeDasharray="4 3"
                />
                {/* Current period fill */}
                <polygon
                    points={`40,${h} ${points.map((p, i) => `${40 + (i / Math.max(1, points.length - 1)) * w},${h - (p / maxY) * h}`).join(" ")} ${w + 40},${h}`}
                    fill="url(#greenGrad)" opacity="0.15"
                />
                {/* Current period line */}
                <polyline
                    points={points.map((p, i) => `${40 + (i / Math.max(1, points.length - 1)) * w},${h - (p / maxY) * h}`).join(" ")}
                    fill="none" stroke="#346853" strokeWidth="2"
                />
                <defs>
                    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#346853" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#346853" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

export default RevenueChart;
