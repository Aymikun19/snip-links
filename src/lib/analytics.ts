export type Click = { clicked_at: string; referrer_host: string | null; device: string | null; country: string | null };

export function deviceFrom(ua: string): "mobile" | "tablet" | "desktop" | "bot" {
  const s = ua.toLowerCase();
  if (/bot|crawler|spider|preview|facebookexternalhit|whatsapp/.test(s)) return "bot";
  if (/ipad|tablet/.test(s)) return "tablet";
  if (/mobi|android|iphone/.test(s)) return "mobile";
  return "desktop";
}

export function referrerHost(ref: string | null): string {
  if (!ref) return "direct";
  try {
    return new URL(ref).hostname.replace(/^www\./, "") || "direct";
  } catch {
    return "direct";
  }
}

const SLUG = /^[a-zA-Z0-9_-]{3,32}$/;
const RESERVED = new Set(["login", "links", "auth", "api", "admin", "_next"]);
export function validSlug(s: string) {
  return SLUG.test(s) && !RESERVED.has(s.toLowerCase());
}

export function randomSlug(len = 6) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

/** Clicks per day for the last `days` days, zero-filled (UTC). */
export function dailySeries(clicks: Click[], days = 30, now = new Date()) {
  const out: { day: string; clicks: number }[] = [];
  const counts = new Map<string, number>();
  for (const c of clicks) {
    const d = c.clicked_at.slice(0, 10);
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)).toISOString().slice(0, 10);
    out.push({ day: d.slice(5), clicks: counts.get(d) ?? 0 });
  }
  return out;
}

export function topBy(clicks: Click[], key: keyof Omit<Click, "clicked_at">, n = 5) {
  const m = new Map<string, number>();
  for (const c of clicks) {
    const k = c[key] ?? "unknown";
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([name, value]) => ({ name, value }));
}
