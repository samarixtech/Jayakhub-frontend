import { Upload, CreditCard, Car, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

const DOCUMENTS = [
  {
    title: "Government ID",
    description: "National ID Card",
    icon: CreditCard,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    title: "Driving License",
    description: "Valid Driver's License",
    icon: Car,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Passport",
    description: "International Passport",
    icon: BookOpen,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

export const StepKyc = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-1">
        <Typography variant={"h4"} className="font-bold text-gray-900">
          Identity Verification
        </Typography>
        <Typography className="text-sm text-slate-500">
          Please upload the following documents to verify your business
          identity.
        </Typography>
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.title}
            className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-emerald-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-xl flex items-center justify-center ${doc.iconBg}`}
              >
                <doc.icon className={`h-6 w-6 ${doc.iconColor}`} />
              </div>
              <div>
                <Typography className="font-bold text-slate-900">
                  {doc.title}
                </Typography>
                <Typography className="text-xs text-slate-400">
                  {doc.description}
                </Typography>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 font-bold px-6 h-10 rounded-xl hover:bg-slate-50 gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="bg-emerald-50/50 border border-emerald-50 p-5 rounded-2xl flex gap-3 items-start mt-8">
        <Info className="h-5 w-5 text-emerald-600 mt-0.5" />
        <Typography className="text-sm text-emerald-800 leading-relaxed">
          By clicking <span className="font-bold">"Complete Setup"</span>, you
          agree to our Partner Terms & Conditions and Privacy Policy. Your
          restaurant will be reviewed within 24 hours.
        </Typography>
      </div>
    </div>
  );
};
