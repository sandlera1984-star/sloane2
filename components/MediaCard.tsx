"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UnderConstructionOverlay from "@/components/UnderConstructionOverlay";
import { hasTermsConsent } from "@/lib/terms";

interface MediaCardProps {
  id: string;
  title: string;
  type: "PHOTO" | "VIDEO";
  thumbnailUrl: string | null;
  locked: boolean;
  publishedAt: string | null;
  canAccess: boolean;
}

export default function MediaCard({
  id,
  title,
  type,
  thumbnailUrl,
  locked,
  publishedAt,
  canAccess,
}: MediaCardProps) {
  const router = useRouter();
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const handleAccess = async () => {
    if (!canAccess || mediaUrl) return;
    setLoading(true);
    const response = await fetch(`/api/media/${id}`);
    if (response.ok) {
      const data = await response.json();
      setMediaUrl(data.url);
    }
    setLoading(false);
  };

  return (
    <div className="card relative overflow-hidden p-4">
      <div
        className={`relative h-48 w-full overflow-hidden rounded-2xl ${
          locked && !canAccess ? "blur-sm" : ""
        }`}
      >
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-rose/30 text-sm font-semibold">
            No thumbnail
          </div>
        )}
      </div>
      {locked && !canAccess && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-night/50 text-white">
          <span className="badge bg-white/80 text-night">Locked</span>
          <p className="text-sm">Subscribe to unlock</p>
          <button
            type="button"
            className="button-primary text-xs"
            onClick={() => {
              if (!hasTermsConsent()) {
                router.push("/terms");
                return;
              }
              setShowOverlay(true);
            }}
          >
            Subscribe now
          </button>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-night/60">
            {type} · {publishedAt ? new Date(publishedAt).toLocaleDateString() : "Draft"}
          </p>
        </div>
        {canAccess && (
          <button
            type="button"
            onClick={handleAccess}
            className="button-secondary text-xs"
            disabled={loading}
          >
            {loading ? "Loading..." : mediaUrl ? "Ready" : "View"}
          </button>
        )}
      </div>
      {canAccess && mediaUrl && (
        <div className="mt-4">
          {type === "PHOTO" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl} alt={title} className="rounded-2xl" />
          ) : (
            <video controls className="w-full rounded-2xl">
              <source src={mediaUrl} />
            </video>
          )}
        </div>
      )}
      <UnderConstructionOverlay open={showOverlay} onClose={() => setShowOverlay(false)}>
        Under Construction
      </UnderConstructionOverlay>
    </div>
  );
}
