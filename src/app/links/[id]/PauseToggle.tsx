"use client";

import { CirclePause, CirclePlay } from "lucide-react";
import { useTransition } from "react";
import { setLinkActive } from "@/app/actions";

export function PauseToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button type="button" className="btn-outline" disabled={pending} onClick={() => start(() => setLinkActive(id, !active))}>
      {active ? <><CirclePause size={15} aria-hidden /> Pause</> : <><CirclePlay size={15} aria-hidden /> Resume</>}
    </button>
  );
}
