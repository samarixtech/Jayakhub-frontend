"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import useLocale from "@/hooks/useLocals";

interface LocalizedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
}

export default function LocalizedLink({
  href,
  children,
  className,
  ...props
}: LocalizedLinkProps) {
  const { country, language } = useLocale();

  // FALLBACK
  if (!country || !language) {
    return (
      <Link href={href} className={className} {...props}>
        {children}
      </Link>
    );
  }

  const localizedHref =
    typeof href === "string"
      ? `/${country.toLowerCase()}/${language.toLowerCase()}${
          href.startsWith("/") ? href : `/${href}`
        }`
      : href;

  return (
    <Link href={localizedHref} className={className} {...props}>
      {children}
    </Link>
  );
}
