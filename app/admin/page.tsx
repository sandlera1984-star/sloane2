import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminUploadForm from "@/components/AdminUploadForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="card p-10 text-center">
          <h1 className="text-3xl font-semibold">Admin access required</h1>
          <Link href="/" className="button-primary mt-6 inline-flex">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, published: true },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Admin control center</h1>
      <p className="mt-2 text-sm text-night/60">
        Upload new releases, manage lock states, and publish notifications.
      </p>
      <div className="mt-8">
        <AdminUploadForm media={media} />
      </div>
    </main>
  );
}
