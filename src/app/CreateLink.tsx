"use client";

import { Scissors } from "lucide-react";
import { useActionState } from "react";
import { CopyButton } from "@/components/kit/CopyButton";
import { createLink } from "./actions";

export function CreateLink({ origin }: { origin: string }) {
  const [state, action, pending] = useActionState(createLink, {} as { error?: string; ok?: string });
  const host = origin.replace(/^https?:\/\//, "");
  return (
    <form action={action} className="card grid gap-4 p-6">
      <h2 className="font-semibold">Shorten a link</h2>
      <label className="field">
        <span>Long URL</span>
        <input name="url" type="url" required placeholder="https://a-very-long-link.com/with/stuff" />
      </label>
      <div className="grid gap-3 sm:grid-cols-[1.2fr_1fr_auto]">
        <label className="field">
          <span>Custom slug (optional)</span>
          <div className="flex items-center rounded-xl border border-stone-300 bg-white pl-3 text-sm text-stone-500 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
            <span className="shrink-0">{host}/</span>
            <input name="slug" placeholder="my-event" className="!border-0 !px-1 !ring-0" />
          </div>
        </label>
        <label className="field"><span>Label (optional)</span><input name="title" placeholder="Launchpad flyer" /></label>
        <button className="btn self-end" disabled={pending}><Scissors size={16} aria-hidden /> {pending ? "Shortening…" : "Shorten"}</button>
      </div>
      {state.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
      {state.ok && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <span>Ready: <b className="font-mono">{host}/{state.ok}</b></span>
          <CopyButton value={`${origin}/${state.ok}`} label="Copy" />
        </div>
      )}
    </form>
  );
}
