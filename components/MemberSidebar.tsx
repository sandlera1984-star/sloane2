import Link from "next/link";

const items = [
  { label: "Subscription", href: "/account/subscription" },
  { label: "Support", href: "/account/support" },
];

export default function MemberSidebar() {
  return (
    <aside className="w-full max-w-[220px] rounded-3xl border border-rose/40 bg-white/70 p-6 shadow-glow">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-plum">
        Member Area
      </p>
      <nav className="flex flex-col gap-3 text-sm font-medium">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full px-3 py-2 hover:bg-rose/20"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
