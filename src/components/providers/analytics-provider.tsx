"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { extractAttribution, persistAttribution, trackEvent } from "@/lib/analytics/events";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const attribution = extractAttribution(new URLSearchParams(searchParams.toString()), pathname);
    persistAttribution(attribution);

    trackEvent({
      name: "page_view",
      path: pathname,
      attribution,
    });
  }, [pathname, searchParams]);

  return null;
}
