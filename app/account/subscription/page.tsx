import Link from "next/link";
import { getSessionUser, isSubscriptionActive } from "@/lib/auth";
import MemberSidebar from "@/components/MemberSidebar";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const user = await getSessionUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="card p-10 text-center">
          <h1 className="text-3xl font-semibold">Sign in required</h1>
          <Link href="/login" className="button-primary mt-6 inline-flex">
            Login
          </Link>
        </div>
      </main>
    );
  }

  const active = isSubscriptionActive(user.subscription?.status ?? null);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row">
      <MemberSidebar />
      <div className="card flex-1 p-10">
        <h1 className="text-2xl font-semibold">Subscription</h1>
        <p className="mt-2 text-sm text-night/60">
          Status: <span className="font-semibold">{user.subscription?.status ?? "none"}</span>
        </p>
        <p className="mt-2 text-sm text-night/60">
          Access: {active ? "Active" : "Inactive"}
        </p>
        <CancelSubscriptionButton />
      </div>
    </main>
  );
}
