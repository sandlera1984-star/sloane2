import Link from "next/link";

const navItems = [
  { label: "Sign Up", href: "/" },
  { label: "Exclusive Content", href: "/exclusive" },
  { label: "Notifications", href: "/notifications" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur border-b border-rose/30">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-semibold text-night">
          Sloane Collective
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-plum">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
