export type LinkLike = { active?: boolean | null; expires_at?: string | null };

/** Badge text and colour for a link's status, or an empty label when it is live with no end date. */
export function linkState(l: LinkLike, now = new Date()): { label: string; tone: string; live: boolean } {
  if (l.active === false) return { label: "Paused", tone: "!bg-stone-200 !text-stone-700", live: false };
  if (l.expires_at) {
    const end = new Date(l.expires_at);
    if (end <= now) return { label: "Expired", tone: "!bg-red-100 !text-red-700", live: false };
    const days = Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
    return { label: days <= 1 ? "Expires today" : `Expires in ${days} days`, tone: "!bg-amber-100 !text-amber-800", live: true };
  }
  return { label: "", tone: "", live: true };
}
