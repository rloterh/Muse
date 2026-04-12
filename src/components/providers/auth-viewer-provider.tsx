"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useViewerStore } from "@/stores/viewer-store";
import type { ViewerSession } from "@/types";

interface AuthViewerProviderProps {
  children: ReactNode;
  initialViewer: ViewerSession | null;
}

export function AuthViewerProvider({ children, initialViewer }: AuthViewerProviderProps) {
  const initializedRef = useRef(false);
  const setViewer = useViewerStore((state) => state.setViewer);

  if (!initializedRef.current) {
    useViewerStore.setState({
      viewer: initialViewer,
      hasHydrated: true,
      menuOpen: false,
      accountMenuOpen: false,
    });
    initializedRef.current = true;
  }

  useEffect(() => {
    setViewer(initialViewer);
  }, [initialViewer, setViewer]);

  return <>{children}</>;
}
