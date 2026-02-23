import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ReviewItem } from "./types";

interface ReviewDetailSheetProps {
    review: ReviewItem | null;
    onClose: () => void;
}

export default function ReviewDetailSheet({ review, onClose }: ReviewDetailSheetProps) {
    return (
        <Sheet open={!!review} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col bg-white border-l border-gray-100 shadow-2xl [&>button]:hidden sm:w-[450px]" side="right">

                {/* Sticky Header */}
                <div className="sticky top-0 bg-white z-10 px-6 py-5 flex items-start justify-between border-b border-gray-100 shrink-0">
                    <div className="flex flex-col gap-1">
                        <SheetTitle className="text-[18px] font-bold text-[#1b2d22] border-none m-0 leading-none">Review Detail</SheetTitle>
                        <span className="text-[12px] font-medium text-[#657a8a] mt-0.5">
                            {review?.orderId ? `Order ${review.orderId} • ${review.time}` : ''}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>

                {review && (
                    <div className="flex-1 flex flex-col p-6 overflow-y-auto custom-scrollbar">

                        {/* Reviewer Section */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={review.avatar}
                                    alt={review.author}
                                    width={56}
                                    height={56}
                                    className="rounded-full shrink-0"
                                />
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[16px] font-bold text-[#1b2d22] leading-none">{review.author}</span>
                                    <div className="flex gap-1 mt-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 stroke-[#f5a623] ${i < review.rating ? 'fill-[#f5a623]' : 'fill-transparent'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full border-t border-dashed border-gray-200 my-6"></div>

                        {/* Stats Section */}
                        <div className="flex items-center gap-12 mb-8">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-[#8ea89a] uppercase tracking-wider">History</span>
                                <span className="text-[13px] font-bold text-[#1b2d22]">{review.history}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold text-[#8ea89a] uppercase tracking-wider">Avg Spend</span>
                                <span className="text-[13px] font-bold text-[#1b2d22]">{review.avgSpend}</span>
                            </div>
                        </div>

                        {/* Review Bubble Section */}
                        <div className="flex flex-col gap-3 mb-8">
                            <h3 className="text-[13px] font-bold text-[#1b2d22]">Review</h3>
                            <div className="border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)]">
                                <p className="text-[13px] text-[#4b5563] font-medium leading-relaxed">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>

                        {/* Reply Section */}
                        {review.replied && review.reply ? (
                            <div className="flex flex-col gap-3">
                                <h3 className="text-[13px] font-bold text-[#1b2d22]">Your Reply</h3>
                                <div className="border border-gray-100 rounded-xl p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                                    <p className="text-[13px] text-[#657a8a] leading-relaxed">
                                        {review.reply.text}
                                    </p>
                                    <span className="text-[11px] font-medium text-[#8ea89a]">Sent {review.reply.time}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <h3 className="text-[13px] font-bold text-[#1b2d22]">Write a Reply</h3>
                                <textarea
                                    className="w-full border border-gray-300 rounded-xl p-4 text-[13px] font-medium text-[#1b2d22] placeholder:text-[#8ea89a] placeholder:font-normal outline-none focus:ring-2 focus:ring-[#357252]/20 focus:border-[#357252]/50 resize-none min-h-[100px]"
                                    placeholder="Type your public response here..."
                                ></textarea>
                                <div className="flex justify-end mt-2">
                                    <button
                                        className="bg-[#357252] hover:bg-[#2e6b49] text-white font-bold text-[13px] px-6 py-2.5 rounded-lg transition-colors"
                                        onClick={onClose}
                                    >
                                        Send Reply
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
