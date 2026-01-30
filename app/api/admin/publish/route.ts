import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { getSessionUser, isSubscriptionActive } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { mediaId, published } = body as {
    mediaId?: string;
    published?: boolean;
  };

  if (!mediaId) {
    return NextResponse.json({ error: "Missing mediaId" }, { status: 400 });
  }

  const media = await prisma.media.update({
    where: { id: mediaId },
    data: {
      published: Boolean(published),
      publishedAt: published ? new Date() : null,
    },
  });

  if (published) {
    const subscribers = await prisma.user.findMany({
      where: {
        subscription: {
          status: { in: ["active", "trialing"] },
        },
        notificationPreference: { optIn: true },
      },
      include: { subscription: true },
    });

    const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";

    await Promise.all(
      subscribers.map(async (subscriber) => {
        if (!isSubscriptionActive(subscriber.subscription?.status ?? null)) {
          return;
        }
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await prisma.magicLinkToken.create({
          data: {
            token,
            userId: subscriber.id,
            expiresAt,
          },
        });
        const magicLink = `${baseUrl}/magic?token=${token}`;
        await sendNotificationEmail({ to: subscriber.email, magicLink });
      })
    );
  }

  return NextResponse.json({ ok: true, media });
}
