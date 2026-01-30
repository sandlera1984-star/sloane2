import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="hero-gradient">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="relative h-64 w-full overflow-hidden rounded-[48px]">
          <Image
            src="/banner-placeholder.svg"
            alt="Sloane Collective banner"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative h-36 w-36 overflow-hidden rounded-full border-8 border-white shadow-glow">
            <Image
              src="/profile-placeholder.svg"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <p className="badge">Exclusive Fashion Media</p>
            <h1 className="text-4xl font-semibold text-night md:text-5xl">
              Join the Sloane Collective
            </h1>
            <p className="max-w-2xl text-base text-night/70">
              Subscribe for a curated vault of premium photos and cinematic videos. Your
              membership unlocks private drops, behind-the-scenes shoots, and bespoke
              notifications for every new release.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/pay" className="button-primary">
              Sign Up
            </Link>
            <Link href="/login" className="button-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
