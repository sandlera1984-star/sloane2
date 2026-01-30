import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendSupportEmail } from "@/lib/email";

export async function POST(request: Request) {
  const user = await getSessionUser();
  const body = await request.json();
  const { name, email, issue } = body as {
    name?: string;
    email?: string;
    issue?: string;
  };

  if (!name || !email || !issue) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (issue.trim().split(/\s+/).length > 200) {
    return NextResponse.json({ error: "Issue exceeds 200 words" }, { status: 400 });
  }

  await prisma.supportTicket.create({
    data: {
      name,
      email,
      issue,
      userId: user?.id ?? null,
    },
  });

  await sendSupportEmail({ name, email, issue });

  return NextResponse.json({ ok: true });
}
