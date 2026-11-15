"use client";

import { useActionState } from "react";
import { createLink } from "./actions";

export function CreateLink({ origin }: { origin: string }) {
  const [state, action, pending] = useActionState(createLink, {} as { error?: string; ok?: string });
  return (
    <form action={action} className="card grid gap-3 p-5">
      <input name="url" required placeholder="https://a-very-long-link.com/with/stuff" className="rounded-xl border border-stone-300 px-3 py-2.5" />
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div className="flex items-center rounded-xl border border-stone-300 pl-3 text-sm text-stone-500">
          {origin.replace(/^https?:\/\//, "")}/<input name="slug" placeholder="custom-slug" className="w-full rounded-r-xl px-1 py-2 text-stone-900 outline-none" />
        </div>
        <input name="title" placeholder="Label (optional)" className="rounded-xl border border-stone-300 px-3 py-2 text-sm" />
        <button className="btn" disabled={pending}>{pending ? "…" : "Shorten"}</button>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Created <b>{origin}/{state.ok}</b></p>}
    </form>
  );
}
