import { NextResponse } from "next/server";
import { getSessionUser, isSubscriptionActive } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSignedBlobUrl } from "@/lib/blob";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  if (!user || !isSubscriptionActive(user.subscription?.status ?? null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (!media || !media.published) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = await getSignedBlobUrl(media.blobPath);
  return NextResponse.json({ url });
}
