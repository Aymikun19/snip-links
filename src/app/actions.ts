"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/supabase/server";
import { randomSlug, validSlug } from "@/lib/analytics";

export async function createLink(_prev: { error?: string; ok?: string }, form: FormData): Promise<{ error?: string; ok?: string }> {
  const { supabase } = await requireUser();
  const url = String(form.get("url") || "").trim();
  let slug = String(form.get("slug") || "").trim();
  try {
    const u = new URL(url);
    if (!["http:", "https:"].includes(u.protocol)) throw new Error();
  } catch {
    return { error: "Enter a full URL starting with http:// or https://" };
  }
  if (slug && !validSlug(slug)) return { error: "Custom slug: 3–32 letters, numbers, - or _" };
  if (!slug) slug = randomSlug();
  const { error } = await supabase.from("links").insert({ url, slug, title: String(form.get("title") || "") || null });
  if (error) return { error: error.code === "23505" ? "That slug is taken" : error.message };
  revalidatePath("/");
  return { ok: slug };
}

export async function deleteLink(id: string) {
  const { supabase } = await requireUser();
  await supabase.from("links").delete().eq("id", id);
  revalidatePath("/");
}

export async function updateLink(id: string, _prev: { error?: string; ok?: boolean }, form: FormData): Promise<{ error?: string; ok?: boolean }> {
  const { supabase } = await requireUser();
  const url = String(form.get("url") || "").trim();
  try {
    const u = new URL(url);
    if (!["http:", "https:"].includes(u.protocol)) throw new Error();
  } catch {
    return { error: "Enter a full URL starting with http:// or https://" };
  }
  const { error } = await supabase.from("links").update({ url, title: String(form.get("title") || "").trim() || null }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath(`/links/${id}`);
  revalidatePath("/");
  return { ok: true };
}
