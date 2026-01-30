import { NextResponse } from "next/server";
import { getSessionUser, isSubscriptionActive } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      subscriptionStatus: user.subscription?.status ?? null,
      subscriptionActive: isSubscriptionActive(user.subscription?.status ?? null),
      notificationOptIn: user.notificationPreference?.optIn ?? false,
    },
  });
}
