"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UnderConstructionOverlay from "@/components/UnderConstructionOverlay";
import { hasTermsConsent } from "@/lib/terms";

const navItems = [
  { label: "Sign Up", href: "/", underConstruction: true },
  { label: "Exclusive Content", href: "/exclusive" },
  { label: "Notifications", href: "/notifications" },
  { label: "Terms", href: "/terms" },
];

export default function Navbar() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (!hasTermsConsent() && item.href !== "/terms") {
      router.push("/terms");
      return;
    }

    if (item.underConstruction) {
      setShowOverlay(true);
      return;
    }

    router.push(item.href);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-rose/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-night">
          Sloane Collective
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNavClick(item)}
              className="hover:text-plum"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <UnderConstructionOverlay open={showOverlay} onClose={() => setShowOverlay(false)}>
        Under Construction
      </UnderConstructionOverlay>
    </header>
  );
}
