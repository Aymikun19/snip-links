import { CirclePause, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Link unavailable" };

export default async function Gone({ searchParams }: { searchParams: Promise<{ slug?: string; why?: string }> }) {
  const { slug = "", why } = await searchParams;
  const expired = why === "expired";
  const Icon = expired ? Clock : CirclePause;
  return (
    <div className="mx-auto grid max-w-md place-items-center gap-4 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent/10 text-accent"><Icon size={28} aria-hidden /></span>
      <h1 className="text-2xl font-semibold tracking-tight">{expired ? "This link has expired" : "This link is paused"}</h1>
      <p className="text-stone-600">
        <span className="font-mono">/{slug}</span> {expired ? "reached its end date and no longer redirects." : "has been switched off by its owner for now."} If you were expecting it to work, ask whoever shared it with you.
      </p>
      <Link href="/" className="btn-outline">Go to Snip</Link>
    </div>
  );
}
