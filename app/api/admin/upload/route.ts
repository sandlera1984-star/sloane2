import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Missing blob token" }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const thumbnail = formData.get("thumbnail") as File | null;
  const title = formData.get("title")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const type = formData.get("type")?.toString() ?? "PHOTO";
  const locked = formData.get("locked")?.toString() === "true";
  const published = formData.get("published")?.toString() === "true";

  if (!file || !title) {
    return NextResponse.json({ error: "Missing file or title" }, { status: 400 });
  }

  const blob = await put(`media/${Date.now()}-${file.name}`, file, {
    access: "private",
    token,
  });

  let thumbnailUrl: string | null = null;
  if (thumbnail) {
    const thumbBlob = await put(`thumbnails/${Date.now()}-${thumbnail.name}`, thumbnail, {
      access: "public",
      token,
    });
    thumbnailUrl = thumbBlob.url;
  }

  const media = await prisma.media.create({
    data: {
      title,
      description,
      type: type === "VIDEO" ? "VIDEO" : "PHOTO",
      blobPath: blob.pathname,
      thumbnailUrl,
      locked,
      published,
      publishedAt: published ? new Date() : null,
    },
  });

  return NextResponse.json({ ok: true, media });
}
