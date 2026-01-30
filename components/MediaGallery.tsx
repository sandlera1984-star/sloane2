"use client";

import { useMemo, useState } from "react";
import MediaCard from "@/components/MediaCard";

interface MediaItem {
  id: string;
  title: string;
  type: "PHOTO" | "VIDEO";
  thumbnailUrl: string | null;
  locked: boolean;
  publishedAt: string | null;
}

interface MediaGalleryProps {
  media: MediaItem[];
  canAccess: boolean;
}

const PAGE_SIZE = 6;

export default function MediaGallery({ media, canAccess }: MediaGalleryProps) {
  const [filter, setFilter] = useState<"ALL" | "PHOTO" | "VIDEO">("ALL");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (filter === "ALL") return media;
    return media.filter((item) => item.type === filter);
  }, [filter, media]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {(["ALL", "PHOTO", "VIDEO"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setFilter(value);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
              filter === value ? "bg-plum text-white" : "bg-white/80"
            }`}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MediaCard key={item.id} {...item} canAccess={canAccess} />
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between text-sm">
        <button
          type="button"
          className="button-secondary"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="button-secondary"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
