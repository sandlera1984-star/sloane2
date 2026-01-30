import { getSessionUser, isSubscriptionActive } from "@/lib/auth";
import { prisma } from "@/lib/db";
import MediaGallery from "@/components/MediaGallery";

export const dynamic = "force-dynamic";

export default async function ExclusivePage() {
  const user = await getSessionUser();
  const subscriptionActive = isSubscriptionActive(user?.subscription?.status ?? null);

  const media = await prisma.media.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-4">
        <p className="badge">Exclusive Content</p>
        <h1 className="text-3xl font-semibold">
          {subscriptionActive ? "Your full gallery" : "Preview the vault"}
        </h1>
        <p className="text-sm text-night/60">
          {subscriptionActive
            ? "Enjoy unlimited access to every shoot and video release."
            : "Browse locked previews and subscribe to unlock everything."}
        </p>
      </div>
      <MediaGallery
        media={media.map((item) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          thumbnailUrl: item.thumbnailUrl,
          locked: item.locked,
          publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
        }))}
        canAccess={Boolean(user) && subscriptionActive}
      />
    </main>
  );
}
