import Link from "next/link";
import { getSessionUser, isSubscriptionActive } from "@/lib/auth";
import NotificationToggle from "@/components/NotificationToggle";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const user = await getSessionUser();
  const active = isSubscriptionActive(user?.subscription?.status ?? null);

  if (!user || !active) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="card p-10 text-center">
          <h1 className="text-3xl font-semibold">Subscribers only</h1>
          <p className="mt-2 text-sm text-night/60">
            Notifications are available to active members.
          </p>
          <Link href="/pay" className="button-primary mt-6 inline-flex">
            Subscribe now
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <NotificationToggle initialOptIn={user.notificationPreference?.optIn ?? true} />
    </main>
  );
}
