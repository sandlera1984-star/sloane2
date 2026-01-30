import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { optIn } = body as { optIn?: boolean };

  const updated = await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    update: { optIn: Boolean(optIn) },
    create: { userId: user.id, optIn: Boolean(optIn) },
  });

  return NextResponse.json({ ok: true, optIn: updated.optIn });
}
