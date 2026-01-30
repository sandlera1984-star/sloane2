"use client";

import { useState } from "react";

interface MediaItem {
  id: string;
  title: string;
  published: boolean;
}

export default function AdminUploadForm({ media }: { media: MediaItem[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PHOTO");
  const [locked, setLocked] = useState(true);
  const [published, setPublished] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setStatus("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("locked", String(locked));
    formData.append("published", String(published));
    formData.append("file", file);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      setStatus("Upload failed.");
      return;
    }
    setStatus("Upload complete.");
    setTitle("");
    setDescription("");
    setFile(null);
    setThumbnail(null);
  };

  const handlePublish = async (mediaId: string, nextPublished: boolean) => {
    const response = await fetch("/api/admin/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mediaId, published: nextPublished }),
    });
    if (!response.ok) {
      setStatus("Unable to update publish state.");
      return;
    }
    setStatus("Publish state updated.");
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpload} className="card space-y-4 p-8">
        <h2 className="text-xl font-semibold">Upload media</h2>
        <input
          type="text"
          placeholder="Title"
          className="input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="input min-h-[120px]"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="PHOTO"
              checked={type === "PHOTO"}
              onChange={() => setType("PHOTO")}
            />
            Photo
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="type"
              value="VIDEO"
              checked={type === "VIDEO"}
              onChange={() => setType("VIDEO")}
            />
            Video
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={locked}
              onChange={(event) => setLocked(event.target.checked)}
            />
            Locked
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) => setPublished(event.target.checked)}
            />
            Publish immediately
          </label>
        </div>
        <div className="space-y-2 text-sm">
          <label className="block">
            Upload media file
            <input
              type="file"
              className="mt-2 block w-full text-sm"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="block">
            Upload thumbnail
            <input
              type="file"
              className="mt-2 block w-full text-sm"
              onChange={(event) => setThumbnail(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <button type="submit" className="button-primary">
          Upload
        </button>
        {status && <p className="text-sm text-night/60">{status}</p>}
      </form>

      <div className="card p-8">
        <h2 className="text-xl font-semibold">Publish controls</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {media.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span>{item.title}</span>
              <button
                type="button"
                className="button-secondary"
                onClick={() => handlePublish(item.id, !item.published)}
              >
                {item.published ? "Unpublish" : "Publish"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
