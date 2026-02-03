"use client";

import { useRouter as useNextRouter } from "next/navigation";
import useLocale from "@/hooks/useLocals";

export function useLocalizedRouter() {
  const router = useNextRouter();
  const { country, language } = useLocale();

  const getLocalizedPath = (path: string) => {
    if (path.startsWith("http")) return path;

    if (!country || !language) return path;

    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `/${country.toLowerCase()}/${language.toLowerCase()}${cleanPath}`;
  };

  const push = (path: string) => {
    router.push(getLocalizedPath(path));
  };

  const replace = (path: string) => {
    router.replace(getLocalizedPath(path));
  };

  const prefetch = (path: string) => {
    router.prefetch(getLocalizedPath(path));
  };

  return {
    ...router,
    push,
    replace,
    prefetch,
  };
}
