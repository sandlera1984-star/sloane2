import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST() {
  const user = await getSessionUser();
  if (!user || !user.stripeSubscriptionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await stripe.subscriptions.cancel(user.stripeSubscriptionId);

  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { status: subscription.status as any },
    create: { userId: user.id, status: subscription.status as any },
  });

  return NextResponse.json({ ok: true, status: subscription.status });
}
