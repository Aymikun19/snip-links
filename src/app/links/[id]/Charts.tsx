"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Row = { name: string; value: number };

export function Charts({ daily, referrers, devices, countries }: { daily: { day: string; clicks: number }[]; referrers: Row[]; devices: Row[]; countries: Row[] }) {
  return (
    <div className="grid gap-4">
      <div className="card p-5">
        <h2 className="mb-3 text-sm font-medium">Clicks per day</h2>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={daily}>
              <CartesianGrid vertical={false} stroke="#eee" />
              <XAxis dataKey="day" fontSize={11} tickLine={false} interval={4} />
              <YAxis allowDecimals={false} fontSize={11} width={28} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="clicks" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Ranked title="Top referrers" rows={referrers} />
        <Ranked title="Devices" rows={devices} />
        <Ranked title="Countries" rows={countries} />
      </div>
    </div>
  );
}

function Ranked({ title, rows }: { title: string; rows: Row[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="card p-5">
      <h2 className="mb-3 text-sm font-medium">{title}</h2>
      {rows.length === 0 && <p className="text-sm text-stone-400">No data yet</p>}
      <ul className="grid gap-2">
        {rows.map((r) => (
          <li key={r.name} className="text-sm">
            <div className="flex justify-between"><span>{r.name}</span><span className="text-stone-500">{r.value}</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-stone-100"><div className="h-full rounded-full bg-accent" style={{ width: `${(r.value / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
