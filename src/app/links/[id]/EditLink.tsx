"use client";

import { Pencil, Save, X } from "lucide-react";
import { useActionState, useRef } from "react";
import { updateLink } from "@/app/actions";

export function EditLink({ id, url, title, expires }: { id: string; url: string; title: string | null; expires: string | null }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [state, action, pending] = useActionState<{ error?: string; ok?: boolean }, FormData>(async (p, f) => {
    const r = await updateLink(id, p, f);
    if (r.ok) dialog.current?.close();
    return r;
  }, {});
  return (
    <>
      <button type="button" className="btn-outline" onClick={() => dialog.current?.showModal()}><Pencil size={15} aria-hidden /> Edit</button>
      <dialog ref={dialog} className="m-auto w-[min(520px,calc(100vw-2rem))] rounded-2xl p-0 shadow-2xl backdrop:bg-stone-900/40">
        <form action={action} className="grid gap-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Edit link</h2>
            <button type="button" className="btn-ghost !p-2" aria-label="Close" onClick={() => dialog.current?.close()}><X size={16} aria-hidden /></button>
          </div>
          <label className="field"><span>Destination URL</span><input name="url" type="url" required defaultValue={url} /></label>
          <label className="field"><span>Label</span><input name="title" defaultValue={title ?? ""} /></label>
          <label className="field">
            <span>Expires on <span className="font-normal text-stone-500">(optional)</span></span>
            <input name="expires" type="date" defaultValue={expires ?? ""} />
          </label>
          <p className="text-xs text-stone-500">After the end of that day (Lagos time) visitors see an “expired” page. Clear the date to keep it forever. The short link stays the same, so printed QR codes keep working.</p>
          {state.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
          <button className="btn justify-self-start" disabled={pending}><Save size={15} aria-hidden /> {pending ? "Saving…" : "Save"}</button>
        </form>
      </dialog>
    </>
  );
}
