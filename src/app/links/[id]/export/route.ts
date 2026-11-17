import { createClient } from "@/lib/supabase/server";
import { csvResponse } from "@/lib/csv";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("Sign in first", { status: 401 });
  const { data: link } = await supabase.from("links").select("slug").eq("id", id).maybeSingle();
  if (!link) return new Response("Not found", { status: 404 });
  const { data } = await supabase.from("clicks").select("clicked_at, referrer_host, device, country").eq("link_id", id).order("clicked_at").limit(50000);
  return csvResponse(`${link.slug}-clicks.csv`, [
    ["Clicked at (UTC)", "Referrer", "Device", "Country"],
    ...(data ?? []).map((c) => [c.clicked_at, c.referrer_host, c.device, c.country]),
  ]);
}
