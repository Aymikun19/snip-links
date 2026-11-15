import { describe, expect, it } from "vitest";
import { dailySeries, deviceFrom, referrerHost, topBy, validSlug } from "./analytics";

describe("deviceFrom", () => {
  it("detects devices", () => {
    expect(deviceFrom("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("mobile");
    expect(deviceFrom("Mozilla/5.0 (Linux; Android 14; SM-A145F)  Mobile")).toBe("mobile");
    expect(deviceFrom("Mozilla/5.0 (iPad; CPU OS 17_0)")).toBe("tablet");
    expect(deviceFrom("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
    expect(deviceFrom("WhatsApp/2.23")).toBe("bot");
  });
});

describe("referrerHost", () => {
  it("normalises hosts", () => {
    expect(referrerHost("https://www.twitter.com/x")).toBe("twitter.com");
    expect(referrerHost(null)).toBe("direct");
    expect(referrerHost("not a url")).toBe("direct");
  });
});

describe("validSlug", () => {
  it("accepts safe slugs and rejects reserved ones", () => {
    expect(validSlug("my-event_2026")).toBe(true);
    expect(validSlug("ab")).toBe(false);
    expect(validSlug("login")).toBe(false);
    expect(validSlug("has space")).toBe(false);
  });
});

describe("aggregation", () => {
  const clicks = [
    { clicked_at: "2026-11-14T10:00:00Z", referrer_host: "twitter.com", device: "mobile", country: "NG" },
    { clicked_at: "2026-11-14T12:00:00Z", referrer_host: "direct", device: "desktop", country: "NG" },
    { clicked_at: "2026-11-15T09:00:00Z", referrer_host: "twitter.com", device: "mobile", country: "GH" },
  ];
  it("zero-fills a daily series", () => {
    const s = dailySeries(clicks, 3, new Date("2026-11-15T20:00:00Z"));
    expect(s).toEqual([
      { day: "11-13", clicks: 0 },
      { day: "11-14", clicks: 2 },
      { day: "11-15", clicks: 1 },
    ]);
  });
  it("ranks top referrers", () => {
    expect(topBy(clicks, "referrer_host")[0]).toEqual({ name: "twitter.com", value: 2 });
  });
});
