"use client";

import { useState, useEffect } from "react";

/**
 * Custom image loading hook for HTML5 canvas rendering.
 * Strictly maintains crossOrigin = "anonymous" to prevent canvas tainting.
 */
export function useImage(
  url: string | null | undefined,
  crossOrigin?: "anonymous" | "use-credentials"
) {
  const [image, setImage] = useState<HTMLImageElement | undefined>();
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");

  useEffect(() => {
    if (!url) {
      setImage(undefined);
      setStatus("loading");
      return;
    }

    let isMounted = true;
    const img = new Image();

    if (crossOrigin) {
      img.crossOrigin = crossOrigin;
    }

    img.onload = () => {
      if (isMounted) {
        setImage(img);
        setStatus("loaded");
      }
    };

    img.onerror = () => {
      if (isMounted) {
        // Never load without crossOrigin as a fallback for canvas usage,
        // because non-crossOrigin images taint the canvas and break export.
        setImage(undefined);
        setStatus("failed");
      }
    };

    img.src = url;

    return () => {
      isMounted = false;
    };
  }, [url, crossOrigin]);

  return [image, status] as const;
}

export default useImage;
