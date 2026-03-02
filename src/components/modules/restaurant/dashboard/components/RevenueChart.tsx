import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
);

interface RevenueChartProps {
  chartData: any;
  maxDataPoint: number;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  chartData,
  maxDataPoint,
}) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1b2d22",
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 12, weight: "normal" as const },
        bodyFont: { size: 14, weight: "bold" as const },
        displayColors: false,
        callbacks: {
          label: (context: any) => `Rs. ${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        suggestedMax: maxDataPoint * 1.2,
        ticks: {
          maxTicksLimit: 5,
          color: "#8ea89a",
          font: { size: 11, weight: 600 },
          callback: (value: any) => "Rs. " + value,
        },
        border: { display: false, dash: [4, 4] },
        grid: { color: "#f3f4f6", drawTicks: false },
      },
      x: {
        ticks: {
          color: "#8ea89a",
          font: { size: 11, weight: 600 },
        },
        border: { display: false },
        grid: { display: false },
      },
    },
  };

  const hasData = chartData?.datasets?.[0]?.data?.length > 0;

  return (
    <Card className="rounded-[16px] border-gray-100 shadow-sm flex flex-col h-[360px] overflow-hidden pt-4">
      <CardHeader className="flex flex-row items-start justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-[16px] font-bold text-[#1b2d22]">
            Revenue Overview
          </CardTitle>
          <CardDescription className="text-[12px] text-[#8ea89a] font-medium">
            Last 7 Days
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1 text-[10px] uppercase tracking-wider"
        >
          This Week
        </Badge>
      </CardHeader>

      <CardContent className="flex-1 pb-6 w-full relative">
        {hasData ? (
          <div className="h-full w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-gray-200 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-sm text-muted-foreground">Gathering data...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
