"use client";

import { ArrowUpDown, ChartArea, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { linkState } from "@/lib/link-state";
import { useMemo, useState } from "react";
import { CopyButton } from "@/components/kit/CopyButton";
import { Sparkline } from "@/components/kit/Charts";
import { deleteLink } from "./actions";

export type LinkRow = { id: string; slug: string; url: string; title: string | null; created_at: string; total: number; trend: number[]; active: boolean; expires_at: string | null };

export function LinkList({ links, origin }: { links: LinkRow[]; origin: string }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "clicks">("new");
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = links.filter((l) => !t || l.slug.toLowerCase().includes(t) || l.url.toLowerCase().includes(t) || (l.title ?? "").toLowerCase().includes(t));
    return sort === "clicks" ? [...list].sort((a, b) => b.total - a.total) : list;
  }, [links, q, sort]);
  const host = origin.replace(/^https?:\/\//, "");

  return (
    <section className="card overflow-hidden" aria-labelledby="links-h">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4">
        <h2 id="links-h" className="font-semibold">Your links <span className="font-normal text-stone-500">({links.length})</span></h2>
        <div className="flex gap-2">
          <label className="relative">
            <span className="sr-only">Search links</span>
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="input !w-48 !py-2 pl-9" />
          </label>
          <button type="button" className="btn-outline !py-2" onClick={() => setSort(sort === "new" ? "clicks" : "new")}>
            <ArrowUpDown size={14} aria-hidden /> {sort === "new" ? "Newest" : "Most clicked"}
          </button>
        </div>
      </div>
      <ul className="divide-y divide-stone-100">
        {shown.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <Link href={`/links/${l.id}`} className="font-mono font-medium text-accent hover:underline">{host}/{l.slug}</Link>
              {l.title && <span className="ml-2 text-sm text-stone-700">{l.title}</span>}
              {(() => { const st = linkState(l); return st.label ? <span className={`badge ml-2 !text-xs ${st.tone}`}>{st.label}</span> : null; })()}
              <p className="truncate text-xs text-stone-500">{l.url}</p>
            </div>
            <div className="hidden sm:block" title="Clicks over the last 14 days"><Sparkline values={l.trend} width={96} height={28} /></div>
            <span className="w-20 text-right text-sm"><b className="tabular-nums">{l.total}</b> <span className="text-stone-500">clicks</span></span>
            <div className="flex items-center gap-1">
              <CopyButton value={`${origin}/${l.slug}`} label="Copy" className="btn-ghost !py-1.5 text-xs" />
              <Link href={`/links/${l.id}`} className="btn-ghost !p-2" aria-label={`Analytics for /${l.slug}`}><ChartArea size={15} aria-hidden /></Link>
              <form action={deleteLink.bind(null, l.id)} onSubmit={(e) => { if (!confirm(`Delete /${l.slug}? Its click history goes too.`)) e.preventDefault(); }}>
                <button className="btn-ghost !p-2 hover:!bg-red-50 hover:!text-red-600" aria-label={`Delete /${l.slug}`}><Trash2 size={15} aria-hidden /></button>
              </form>
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="p-10 text-center text-sm text-stone-500">{links.length ? "No links match." : "No links yet. Shorten your first one above."}</li>}
      </ul>
    </section>
  );
}
