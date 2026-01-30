import { resend } from "@/lib/resend";

export async function sendNotificationEmail({
  to,
  magicLink,
}: {
  to: string;
  magicLink: string;
}) {
  if (!process.env.RESEND_FROM) {
    throw new Error("Missing RESEND_FROM");
  }
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to,
    subject: "New exclusive content released",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;">
        <p>New exclusive content released today view now!</p>
        <p><a href="${magicLink}" style="display:inline-block;padding:12px 20px;background:#8b5cf6;color:#fff;border-radius:999px;text-decoration:none;">View now</a></p>
      </div>
    `,
  });
}

export async function sendSupportEmail({
  name,
  email,
  issue,
}: {
  name: string;
  email: string;
  issue: string;
}) {
  if (!process.env.RESEND_FROM) {
    throw new Error("Missing RESEND_FROM");
  }
  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: "insanitybjones@gmail.com",
    subject: `Support request from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Issue:</strong></p>
      <p>${issue}</p>
    `,
  });
}
