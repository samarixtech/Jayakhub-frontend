import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { useTranslations } from "next-intl";

export function PaymentHistoryHeader() {
    const t = useTranslations('CustomerDashboard.PaymentHistory');
    return (
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <Typography
                    variant="h2"
                    className="text-[#1E293B] font-bold text-[22px] tracking-tight"
                >
                    {t('title')}
                </Typography>
                <Typography className="text-[#64748B] text-[13px] font-medium mt-1">
                    {t('subtitle')}
                </Typography>
            </div>
            <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm relative">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                </button>
                <Button className="h-10 rounded-full bg-white text-[#1E293B] hover:bg-gray-50 border border-gray-200 shadow-sm font-bold text-[13px] px-5">
                    <FileDown className="w-4 h-4 mr-2 stroke-[2.5px]" /> {t('export_pdf')}
                </Button>
            </div>
        </header>
    );
}
