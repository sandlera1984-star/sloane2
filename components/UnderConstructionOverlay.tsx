"use client";

import { ReactNode } from "react";

interface UnderConstructionOverlayProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export default function UnderConstructionOverlay({
  open,
  onClose,
  children,
}: UnderConstructionOverlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night/50 p-6"
      onClick={onClose}
    >
      <div className="flex h-48 w-48 items-center justify-center rounded-full bg-plum text-center text-sm font-semibold text-white shadow-glow">
        {children ?? "Under Construction"}
      </div>
    </div>
  );
}
