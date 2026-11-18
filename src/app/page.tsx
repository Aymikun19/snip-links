import { Link2, MousePointerClick, Trophy, Zap } from "lucide-react";
import { SITE_URL } from "@/lib/supabase/config";
import { getUser } from "@/lib/supabase/server";
import { dailySeries, type Click } from "@/lib/analytics";
import { Landing } from "@/components/kit/Landing";
import { BarChart } from "@/components/kit/Charts";
import { Stat } from "@/components/kit/Stat";
import { CreateLink } from "./CreateLink";
import { LinkList, type LinkRow } from "./LinkList";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ notfound?: string }> }) {
  const { notfound } = await searchParams;
  const { supabase, user } = await getUser();
  if (!user) return <Landing />;
  const since = new Date(new Date().setUTCHours(0, 0, 0, 0) - 13 * 86_400_000).toISOString();
  const [{ data: links }, { data: recent }] = await Promise.all([
    supabase.from("links").select("id, slug, url, title, created_at, active, expires_at, clicks(count)").order("created_at", { ascending: false }),
    supabase.from("clicks").select("link_id, clicked_at, device").gte("clicked_at", since).neq("device", "bot").limit(20000),
  ]);
  const clicks = (recent ?? []) as (Click & { link_id: string })[];
  const rows: LinkRow[] = (links ?? []).map((l) => ({
    id: l.id, slug: l.slug, url: l.url, title: l.title, created_at: l.created_at, active: l.active, expires_at: l.expires_at,
    total: (l.clicks as unknown as { count: number }[])[0]?.count ?? 0,
    trend: dailySeries(clicks.filter((c) => c.link_id === l.id), 14).map((d) => d.clicks),
  }));
  const series = dailySeries(clicks, 14);
  const total = rows.reduce((s, l) => s + l.total, 0);
  const top = [...rows].sort((a, b) => b.total - a.total)[0];
  const today = series[series.length - 1]?.clicks ?? 0;

  return (
    <div className="grid gap-8">
      {notfound && <p className="card border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">No link called “{notfound}”.</p>}
      <div>
        <p className="eyebrow">Dashboard</p>
        <h1 className="page-title mt-1">Your links</h1>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Link2} label="Links" value={String(rows.length)} />
        <Stat icon={MousePointerClick} label="Total clicks" value={String(total)} hint="All time, including previews" />
        <Stat icon={Zap} label="Clicks today" value={String(today)} />
        <Stat icon={Trophy} label="Top link" value={top && top.total ? `/${top.slug}` : "–"} hint={top && top.total ? `${top.total} clicks` : undefined} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <CreateLink origin={SITE_URL} />
        <section className="card p-6" aria-labelledby="trend">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 id="trend" className="font-semibold">Clicks, all links</h2>
            <span className="text-xs text-stone-500">Last 14 days</span>
          </div>
          <BarChart label="Clicks per day across all links" height={150} data={series.map((d) => ({ label: d.day, value: d.clicks }))} />
        </section>
      </div>
      <LinkList links={rows} origin={SITE_URL} />
    </div>
  );
}
