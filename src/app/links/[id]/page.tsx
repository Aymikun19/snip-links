import { CornerDownRight, Download, Globe, MousePointerClick, Bot, Smartphone } from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/supabase/config";
import { requireUser } from "@/lib/supabase/server";
import { dailySeries, topBy, type Click } from "@/lib/analytics";
import { CopyButton } from "@/components/kit/CopyButton";
import { Stat } from "@/components/kit/Stat";
import { Charts } from "./Charts";
import { EditLink } from "./EditLink";
import { PauseToggle } from "./PauseToggle";
import { linkState } from "@/lib/link-state";

export default async function LinkStats({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireUser();
  const { data: link } = await supabase.from("links").select("*").eq("id", id).maybeSingle();
  if (!link) notFound();
  const since = new Date(new Date().setUTCHours(0, 0, 0, 0) - 29 * 86_400_000).toISOString();
  const { data } = await supabase.from("clicks").select("clicked_at, referrer_host, device, country").eq("link_id", id).gte("clicked_at", since).limit(10000);
  const clicks = (data ?? []) as Click[];
  const humans = clicks.filter((c) => c.device !== "bot");
  const short = `${SITE_URL}/${link.slug}`;
  const [png, svg] = await Promise.all([
    QRCode.toDataURL(short, { width: 600, margin: 1 }),
    QRCode.toString(short, { type: "svg", margin: 1 }),
  ]);
  const state = linkState(link);
  const expiresDay = link.expires_at ? new Date(new Date(link.expires_at).getTime() + 3600_000).toISOString().slice(0, 10) : null;
  const mobile = humans.filter((c) => c.device === "mobile").length;

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link href="/" className="text-sm text-stone-500 hover:text-accent">Your links</Link>
          <h1 className="page-title mt-1 flex flex-wrap items-center gap-2 font-mono">
            /{link.slug}
            {state.label && <span className={`badge font-sans !text-xs ${state.tone}`}>{state.label}</span>}
          </h1>
          {link.title && <p className="text-stone-700">{link.title}</p>}
          <p className="mt-1 flex items-center gap-1 truncate text-sm text-stone-500">
            <CornerDownRight size={14} className="shrink-0" aria-hidden /> <a href={link.url} className="truncate hover:underline">{link.url}</a>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton value={short} label="Copy short link" />
          <PauseToggle id={link.id} active={link.active} />
          <EditLink id={link.id} url={link.url} title={link.title} expires={expiresDay} />
          <a href={`/links/${id}/export`} className="btn-outline"><Download size={15} aria-hidden /> CSV</a>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={MousePointerClick} label="Clicks (30 days)" value={String(humans.length)} />
        <Stat icon={Smartphone} label="On mobile" value={humans.length ? `${Math.round((mobile / humans.length) * 100)}%` : "–"} />
        <Stat icon={Globe} label="Countries" value={String(new Set(humans.map((c) => c.country).filter(Boolean)).size)} />
        <Stat icon={Bot} label="Link previews" value={String(clicks.length - humans.length)} hint="WhatsApp, Slack and other bots" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Charts daily={dailySeries(humans)} referrers={topBy(humans, "referrer_host")} devices={topBy(humans, "device")} countries={topBy(humans, "country")} />
        <section className="card grid h-fit gap-4 p-6" aria-labelledby="qr">
          <h2 id="qr" className="font-semibold">QR code</h2>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={png} alt={`QR code for ${short}`} className="w-full rounded-xl border border-stone-200" />
          <div className="grid grid-cols-2 gap-2">
            <a href={png} download={`${link.slug}-qr.png`} className="btn-outline"><Download size={15} aria-hidden /> PNG</a>
            <a href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} download={`${link.slug}-qr.svg`} className="btn-outline"><Download size={15} aria-hidden /> SVG</a>
          </div>
          <p className="text-xs text-stone-500">SVG stays sharp at any size, ideal for posters.</p>
        </section>
      </div>
    </div>
  );
}
