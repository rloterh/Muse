"use client";

import { create } from "zustand";
import { canAccessViewerRole } from "@/lib/auth/roles";
import type { ViewerRole, ViewerSession } from "@/types";

interface ViewerState {
  viewer: ViewerSession | null;
  hasHydrated: boolean;
  menuOpen: boolean;
  accountMenuOpen: boolean;
  setViewer: (viewer: ViewerSession | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setMenuOpen: (open: boolean) => void;
  setAccountMenuOpen: (open: boolean) => void;
  closeOverlays: () => void;
}

export const useViewerStore = create<ViewerState>()((set) => ({
  viewer: null,
  hasHydrated: false,
  menuOpen: false,
  accountMenuOpen: false,
  setViewer: (viewer) =>
    set({
      viewer,
      hasHydrated: true,
      accountMenuOpen: false,
      menuOpen: false,
    }),
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
  setMenuOpen: (menuOpen) => set({ menuOpen, accountMenuOpen: false }),
  setAccountMenuOpen: (accountMenuOpen) => set({ accountMenuOpen, menuOpen: false }),
  closeOverlays: () => set({ menuOpen: false, accountMenuOpen: false }),
}));

export function canAccessRole(
  viewer: ViewerSession | null,
  minimumRole: Exclude<ViewerRole, "guest">
) {
  return canAccessViewerRole(viewer?.role, minimumRole);
}
