import { describe, expect, it } from "vitest";
import { linkState } from "./link-state";

const now = new Date("2026-11-18T12:00:00Z");
describe("linkState", () => {
  it("is live with no label by default", () => expect(linkState({ active: true }, now)).toMatchObject({ label: "", live: true }));
  it("reports paused first", () => expect(linkState({ active: false, expires_at: "2020-01-01T00:00:00Z" }, now).label).toBe("Paused"));
  it("reports expired", () => expect(linkState({ active: true, expires_at: "2026-11-18T11:00:00Z" }, now)).toMatchObject({ label: "Expired", live: false }));
  it("counts days left", () => expect(linkState({ expires_at: "2026-11-21T12:00:00Z" }, now).label).toBe("Expires in 3 days"));
});
