-- Snip schema.

create table public.links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade default auth.uid(),
  slug text not null unique check (slug ~ '^[a-zA-Z0-9_-]{3,32}$'),
  url text not null check (url ~* '^https?://'),
  title text,
  created_at timestamptz not null default now()
);

create table public.clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.links on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer_host text,
  device text,
  country text
);
create index on public.clicks (link_id, clicked_at);

alter table public.links enable row level security;
alter table public.clicks enable row level security;

create policy "own links" on public.links for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "own clicks" on public.clicks for select
  using (exists (select 1 from public.links l where l.id = link_id and l.owner_id = auth.uid()));

-- Called by the public redirect route: records the click and returns the target URL.
create function public.resolve_link(p_slug text, p_referrer text, p_device text, p_country text)
returns text language plpgsql security definer set search_path = '' as $$
declare l public.links;
begin
  select * into l from public.links where slug = p_slug;
  if not found then return null; end if;
  insert into public.clicks (link_id, referrer_host, device, country) values (l.id, p_referrer, p_device, p_country);
  return l.url;
end $$;
grant execute on function public.resolve_link to anon, authenticated;
