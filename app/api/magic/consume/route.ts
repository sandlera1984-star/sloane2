import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, isSubscriptionActive } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body as { token?: string };

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const magicLink = await prisma.magicLinkToken.findUnique({
    where: { token },
    include: { user: { include: { subscription: true } } },
  });

  if (!magicLink || magicLink.usedAt || magicLink.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  if (!isSubscriptionActive(magicLink.user.subscription?.status ?? null)) {
    return NextResponse.json({ error: "Subscription inactive" }, { status: 403 });
  }

  await prisma.magicLinkToken.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  await createSession(magicLink.userId);

  return NextResponse.json({ ok: true });
}
