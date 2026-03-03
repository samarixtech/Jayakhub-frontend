import { useState } from "react";
import { Star } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ReviewItem } from "../../restaurant.types";
import { useServerAction } from "@/hooks/use-server-action";
import { replyToReviewAction } from "@/app/actions/restaurant/reviews";
import { toast } from "react-hot-toast";

interface ReviewDetailSheetProps {
  review: ReviewItem | null;
  onClose: () => void;
  refetch: () => void;
}

export default function ReviewDetailSheet({
  review,
  onClose,
  refetch,
}: ReviewDetailSheetProps) {
  const [replyText, setReplyText] = useState("");

  const { execute: submitReply, isPending } = useServerAction(
    replyToReviewAction,
    {
      onSuccess: () => {
        toast.success("Reply submitted successfully!");
        setReplyText("");
        refetch();
        onClose();
      },
    },
  );

  const handleSendReply = async () => {
    if (!review?.id) return;
    if (!replyText.trim()) {
      toast.error("Reply text cannot be empty.");
      return;
    }
    await submitReply({ reviewId: review.id, replyText: replyText });
  };

  // Derived flags & data processing
  const isReplied = review?.reply !== null;
  const historyText = review?.customerMetrics
    ? `${review.customerMetrics.totalOrders} lifetime orders`
    : "New Customer";
  const avgSpendText = review?.customerMetrics
    ? `$${review.customerMetrics.averageSpend.toFixed(2)}`
    : "$0.00";

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayDate = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <Sheet
      open={!!review}
      onOpenChange={(open) => {
        if (!open) {
          setReplyText("");
          onClose();
        }
      }}
    >
      <SheetContent
        className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col bg-white border-l border-gray-100 shadow-2xl [&>button]:hidden sm:w-[450px]"
        side="right"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-5 flex items-start justify-between border-b border-gray-100 shrink-0">
          <div className="flex flex-col gap-1">
            <SheetTitle className="text-[18px] font-bold text-[#1b2d22] border-none m-0 leading-none">
              Review Detail
            </SheetTitle>
            <span className="text-[12px] font-medium text-[#657a8a] mt-0.5">
              {review?.orderId
                ? `Order ${review.orderId} • ${displayDate}`
                : ""}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {review && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">
            {/* Reviewer Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#E2F1E8] text-[#1b2d22] flex shrink-0 items-center justify-center font-bold text-lg border border-gray-100 uppercase tracking-wide">
                  {getInitials(review.userName)}
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[16px] font-bold text-[#1b2d22] leading-none">
                    {review.userName}
                  </span>
                  <div className="flex gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 stroke-[#f5a623] ${i < review.rating ? "fill-[#f5a623]" : "fill-transparent"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-gray-200 my-6"></div>

            {/* Stats Section */}
            <div className="flex items-center gap-12 mb-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8ea89a] uppercase tracking-wider">
                  History
                </span>
                <span className="text-[13px] font-bold text-[#1b2d22]">
                  {historyText}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-[#8ea89a] uppercase tracking-wider">
                  Avg Spend
                </span>
                <span className="text-[13px] font-bold text-[#1b2d22]">
                  {avgSpendText}
                </span>
              </div>
            </div>

            {/* Review Bubble Section */}
            <div className="flex flex-col gap-3 mb-8">
              <h3 className="text-[13px] font-bold text-[#1b2d22]">Review</h3>
              <div className="border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                <p className="text-[13px] text-[#4b5563] font-medium leading-relaxed">
                  "{review.comment}"
                </p>
              </div>
            </div>

            {/* Reply Section */}
            {isReplied && review.reply ? (
              <div className="flex flex-col gap-3">
                <h3 className="text-[13px] font-bold text-[#1b2d22]">
                  Your Reply
                </h3>
                <div className="border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                  <p className="text-[13px] text-[#657a8a] leading-relaxed">
                    {review.reply}
                  </p>
                  <span className="text-[11px] font-medium text-[#8ea89a]">
                    Sent Recently
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <h3 className="text-[13px] font-bold text-[#1b2d22]">
                  Write a Reply
                </h3>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-4 text-[13px] font-medium text-[#1b2d22] placeholder:text-[#8ea89a] placeholder:font-normal outline-none focus:ring-2 focus:ring-[#357252]/20 focus:border-[#357252]/50 resize-none min-h-[100px]"
                  placeholder="Type your public response here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isPending}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-[#357252] hover:bg-[#2e6b49] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    onClick={handleSendReply}
                    disabled={isPending}
                  >
                    {isPending ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
