"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UnderConstructionOverlay from "@/components/UnderConstructionOverlay";
import { hasTermsConsent } from "@/lib/terms";

interface UnderConstructionButtonProps {
  label: string;
  className?: string;
}

export default function UnderConstructionButton({
  label,
  className,
}: UnderConstructionButtonProps) {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClick = () => {
    if (!hasTermsConsent()) {
      router.push("/terms");
      return;
    }
    setShowOverlay(true);
  };

  return (
    <>
      <button type="button" className={className} onClick={handleClick}>
        {label}
      </button>
      <UnderConstructionOverlay open={showOverlay} onClose={() => setShowOverlay(false)}>
        Under Construction
      </UnderConstructionOverlay>
    </>
  );
}
