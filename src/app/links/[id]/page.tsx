import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/server";
import { dailySeries, topBy, type Click } from "@/lib/analytics";
import { Charts } from "./Charts";

export default async function LinkStats({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data: link } = await supabase.from("links").select("*").eq("id", id).maybeSingle();
  if (!link) notFound();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const { data } = await supabase.from("clicks").select("clicked_at, referrer_host, device, country").eq("link_id", id).gte("clicked_at", since).limit(10000);
  const clicks = (data ?? []) as Click[];
  const humans = clicks.filter((c) => c.device !== "bot");
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">/{link.slug}</h1>
        <p className="truncate text-sm text-stone-500">→ {link.url}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Clicks (30 days)" value={humans.length} />
        <Stat label="Link previews / bots" value={clicks.length - humans.length} />
        <Stat label="Countries" value={new Set(humans.map((c) => c.country).filter(Boolean)).size} />
      </div>
      <Charts
        daily={dailySeries(humans)}
        referrers={topBy(humans, "referrer_host")}
        devices={topBy(humans, "device")}
        countries={topBy(humans, "country")}
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
