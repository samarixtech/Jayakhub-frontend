import { Check } from "lucide-react";
import { STEPS } from "./onboarding.constants";

interface StepperProgressProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepperProgress = ({
  currentStep,
  onStepClick,
}: StepperProgressProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="relative flex justify-between min-w-[800px] w-full my-4 sm:my-7 px-4 sm:px-10">
        <div className="absolute top-4 left-20 right-20 h-px bg-emerald-100 z-0" />
        {STEPS.map((step) => (
          <div
            key={step.id}
            className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => onStepClick(step.id)}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-[#346853] text-white scale-110 shadow-lg shadow-emerald-900/20"
                  : "bg-white border border-emerald-100 text-gray-300 group-hover:border-[#346853] group-hover:text-[#346853]"
              }`}
            >
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                currentStep >= step.id
                  ? "text-[#346853]"
                  : "text-gray-300 group-hover:text-[#346853]"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
