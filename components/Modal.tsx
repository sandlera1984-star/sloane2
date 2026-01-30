"use client";

import { ReactNode } from "react";

interface ModalProps {
  title: string;
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ title, open, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/50 p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-cream p-8 shadow-glow">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-semibold text-night">{title}</h2>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-semibold text-plum"
            >
              Close
            </button>
          )}
        </div>
        <div className="mt-4 space-y-4 text-sm text-night/80">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-4">{footer}</div>}
      </div>
    </div>
  );
}
