"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { demoSessions } from "@/lib/site/config";
import type { ViewerRole, ViewerSession } from "@/types";

interface ViewerState {
  viewer: ViewerSession | null;
  menuOpen: boolean;
  accountMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  setAccountMenuOpen: (open: boolean) => void;
  signInAs: (role: Exclude<ViewerRole, "guest">) => void;
  signOut: () => void;
  closeOverlays: () => void;
}

export const useViewerStore = create<ViewerState>()(
  persist(
    (set) => ({
      viewer: null,
      menuOpen: false,
      accountMenuOpen: false,
      setMenuOpen: (menuOpen) => set({ menuOpen }),
      setAccountMenuOpen: (accountMenuOpen) => set({ accountMenuOpen }),
      signInAs: (role) =>
        set({ viewer: demoSessions[role], accountMenuOpen: false, menuOpen: false }),
      signOut: () => set({ viewer: null, accountMenuOpen: false, menuOpen: false }),
      closeOverlays: () => set({ menuOpen: false, accountMenuOpen: false }),
    }),
    {
      name: "muse-viewer-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ viewer: state.viewer }),
    }
  )
);

export function canAccessRole(
  viewer: ViewerSession | null,
  minimumRole: Exclude<ViewerRole, "guest">
) {
  if (!viewer) return false;

  const hierarchy: ViewerRole[] = ["guest", "client", "editor", "admin"];
  return hierarchy.indexOf(viewer.role) >= hierarchy.indexOf(minimumRole);
}
