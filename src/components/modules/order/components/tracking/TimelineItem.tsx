import React from "react";

export interface TimelineItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  time?: string;
  status: "completed" | "active" | "pending";
  isLast?: boolean;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  icon: Icon,
  title,
  description,
  time,
  status,
  isLast = false,
}) => {
  const isActive = status === "completed" || status === "active";
  const isCompleted = status === "completed";

  return (
    <div className="flex gap-4 relative">
      {/* Line connecting items */}
      {!isLast && (
        <div
          className={`absolute left-[19px] top-10 bottom-[-24px] w-0.5 ${
            isCompleted ? "bg-[#346853]" : "bg-gray-200"
          }`}
        />
      )}

      {/* Icon Circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
          isActive ? "bg-[#346853] text-white" : "bg-gray-100 text-gray-400"
        }`}
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="pb-8">
        <h3
          className={`font-bold text-lg ${
            isActive ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-md">{description}</p>
        {time && (
          <p
            className={`text-xs font-bold mt-2 ${
              isActive ? "text-[#346853]" : "text-gray-400"
            }`}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
};
