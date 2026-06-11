"use client";

import { Share2, Facebook, Twitter, Linkedin, Check } from "lucide-react";
import { useState } from "react";

type Props = {
  shareLabel: string;
  copyLabel: string;
  title: string;
};

export default function BlogShareButtons({ shareLabel, copyLabel, title }: Props) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const input = document.createElement("input");
      input.value = getUrl();
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openShare = (url: string) => {
    window.open(url, "_blank", "width=600,height=400,noopener,noreferrer");
  };

  return (
    <div className="flex items-center gap-4 mb-12 border-b border-[#E2E8F0] pb-8 flex-wrap">
      <span className="text-sm font-bold text-foreground">{shareLabel}</span>

      <button
        onClick={() =>
          openShare(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`
          )
        }
        aria-label="Share on Twitter"
        className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#1DA1F2] hover:text-white transition-colors"
      >
        <Twitter className="w-4 h-4" />
      </button>

      <button
        onClick={() =>
          openShare(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`
          )
        }
        aria-label="Share on Facebook"
        className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#4267B2] hover:text-white transition-colors"
      >
        <Facebook className="w-4 h-4" />
      </button>

      <button
        onClick={() =>
          openShare(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`
          )
        }
        aria-label="Share on LinkedIn"
        className="w-9 h-9 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#0077B5] hover:text-white transition-colors"
      >
        <Linkedin className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-[#E2E8F0] mx-2" />

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-primary transition-colors"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {copied ? "Copied!" : copyLabel}
      </button>
    </div>
  );
}
