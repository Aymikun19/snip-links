import { MousePointerClick, Trash2 } from "lucide-react";
import { SITE_URL } from "@/lib/supabase/config";
import Link from "next/link";
import { requireUser } from "@/lib/supabase/server";
import { CreateLink } from "./CreateLink";
import { deleteLink } from "./actions";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ notfound?: string }> }) {
  const { notfound } = await searchParams;
  const { supabase } = await requireUser();
  const { data: links } = await supabase.from("links").select("id, slug, url, title, created_at, clicks(count)").order("created_at", { ascending: false });
  const origin = SITE_URL;
  return (
    <div className="grid gap-6">
      {notfound && <p className="card border-amber-200 bg-amber-50 p-3 text-sm">No link called “{notfound}”.</p>}
      <h1 className="text-2xl font-semibold">Your links</h1>
      <CreateLink origin={origin} />
      <div className="card divide-y divide-stone-100">
        {(links ?? []).map((l) => (
          <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <Link href={`/links/${l.id}`} className="font-medium text-accent hover:underline">/{l.slug}</Link>
              {l.title && <span className="ml-2 text-sm">{l.title}</span>}
              <p className="truncate text-xs text-stone-500">{l.url}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="badge inline-flex items-center gap-1"><MousePointerClick size={12} aria-hidden /> {(l.clicks as unknown as { count: number }[])[0]?.count ?? 0} clicks</span>
              <form action={deleteLink.bind(null, l.id)}>
                <button className="text-stone-400 hover:text-red-600" aria-label={`Delete /${l.slug}`}><Trash2 size={15} /></button>
              </form>
            </div>
          </div>
        ))}
        {links?.length === 0 && <p className="p-4 text-sm text-stone-500">No links yet.</p>}
      </div>
    </div>
  );
}
