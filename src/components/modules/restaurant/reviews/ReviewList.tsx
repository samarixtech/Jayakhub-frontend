"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Reply } from "lucide-react";
import { ReviewItem, MOCK_REVIEWS_DATA } from "./types";
import ReviewDetailSheet from "./ReviewDetailSheet";

export default function ReviewList() {
    const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

    return (
        <div className="flex flex-col gap-4 mt-8">

            {/* Filter Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button className="bg-[#357252] text-white px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap">
                    All Reviews
                </button>
                <button className="bg-white border text-gray-700 hover:bg-gray-50 border-gray-200 px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap">
                    Unreplied
                </button>
                <button className="bg-white border text-gray-700 hover:bg-gray-50 border-gray-200 px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap">
                    5 Stars
                </button>
                <button className="bg-white border text-gray-700 hover:bg-gray-50 border-gray-200 px-5 py-2 rounded-full text-[12px] font-bold whitespace-nowrap flex items-center gap-1">
                    Critical (1-3) <span className="text-[10px]">▼</span>
                </button>
            </div>

            {/* Review Cards */}
            <div className="flex flex-col gap-4">
                {MOCK_REVIEWS_DATA.map((review) => (
                    <div
                        key={review.id}
                        onClick={() => setSelectedReview(review)}
                        className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col gap-4 cursor-pointer hover:border-[#357252]/30 transition-colors"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Image
                                    src={review.avatar}
                                    alt={review.author}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-[#1b2d22]">{review.author}</span>
                                    <span className="text-[11px] font-medium text-[#8ea89a]">{review.time} • Order {review.orderId}</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 stroke-[#f5a623] ${i < review.rating ? 'fill-[#f5a623]' : 'fill-transparent'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-[13px] text-[#1b2d22] font-medium leading-relaxed">
                            {review.text}
                        </p>

                        {!review.replied && (
                            <div className="flex mt-2">
                                <button
                                    className="flex items-center gap-2 text-[#357252] text-[12px] font-bold hover:underline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedReview(review);
                                    }}
                                >
                                    <Reply className="w-3.5 h-3.5 scale-x-[-1]" />
                                    Reply
                                </button>
                            </div>
                        )}

                        {/* Restaurant Reply Block */}
                        {review.replied && review.reply && (
                            <div className="mt-3 border border-gray-100 rounded-xl p-4 flex flex-col gap-2.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[#357252] text-[12px] font-bold">
                                        <Reply className="w-3.5 h-3.5 scale-x-[-1]" />
                                        Restaurant Reply
                                    </div>
                                    <span className="text-[11px] font-medium text-[#8ea89a]">{review.reply.time}</span>
                                </div>
                                <p className="text-[13px] text-[#8ea89a] leading-relaxed">
                                    {review.reply.text}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <ReviewDetailSheet
                review={selectedReview}
                onClose={() => setSelectedReview(null)}
            />
        </div>
    );
}
