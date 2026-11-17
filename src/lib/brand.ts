import { ChartArea, FileDown, Link2, PencilLine, QrCode, Smartphone } from "lucide-react";

export const brand = {
  name: "Snip",
  short: "Short links with click analytics",
  eyebrow: "Link shortener and analytics",
  tagline: "Short links that tell you who clicked.",
  description:
    "Turn long URLs into short, memorable links, share them anywhere and see daily clicks, top referrers and devices for every link.",
  cta: { href: "/login?mode=signup", label: "Shorten your first link" },
  proof: ["Custom slugs", "QR codes", "Privacy-friendly analytics"],
  features: [
    { icon: Link2, title: "Custom short links", text: "Pick your own slug or let Snip generate one. Links work instantly." },
    { icon: ChartArea, title: "Click analytics", text: "Daily clicks, top referrers and device breakdowns, charted for each link." },
    { icon: QrCode, title: "QR code for every link", text: "Download a QR code for posters, flyers and slides." },
    { icon: Smartphone, title: "Overview dashboard", text: "Total clicks, your top link and a 14-day trend across all your links." },
    { icon: PencilLine, title: "Edit destinations", text: "Change where a link points without reprinting it." },
    { icon: FileDown, title: "Export clicks", text: "Download raw click data as CSV for your own analysis." },
  ],
  steps: [
    ["Paste a long URL", "Choose a slug or use the generated one."],
    ["Share it anywhere", "Post the link or print its QR code."],
    ["Watch the clicks", "See where your audience comes from, day by day."],
  ] as [string, string][],
  closing: "Know which link actually worked.",
  nav: [{ href: "/", label: "Links" }] as { href: string; label: string; public?: boolean }[],
  width: "max-w-5xl",
  repo: "https://github.com/Aymikun19/snip-links",
  preview: null as string | null,
};
