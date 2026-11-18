import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deviceFrom, referrerHost } from "@/lib/analytics";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: url } = await supabase.rpc("resolve_link", {
    p_slug: slug,
    p_referrer: referrerHost(request.headers.get("referer")),
    p_device: deviceFrom(request.headers.get("user-agent") ?? ""),
    p_country: request.headers.get("x-vercel-ip-country"), // set automatically on Vercel
  });
  if (!url) return NextResponse.redirect(new URL("/?notfound=" + encodeURIComponent(slug), request.url));
  if (url === "!paused" || url === "!expired")
    return NextResponse.redirect(new URL(`/gone?slug=${encodeURIComponent(slug)}&why=${(url as string).slice(1)}`, request.url));
  return NextResponse.redirect(url as string, 307);
}
