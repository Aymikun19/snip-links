-- Everything lives in the "snip" schema so this app can share a Supabase project with others.
-- After running, add "snip" under Supabase → Project Settings → Data API → Exposed schemas.
create schema if not exists snip;
grant usage on schema snip to anon, authenticated, service_role;
alter default privileges in schema snip grant all on tables to anon, authenticated, service_role;
alter default privileges in schema snip grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema snip grant execute on functions to anon, authenticated, service_role;

-- Snip schema.

create table snip.links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade default auth.uid(),
  slug text not null unique check (slug ~ '^[a-zA-Z0-9_-]{3,32}$'),
  url text not null check (url ~* '^https?://'),
  title text,
  created_at timestamptz not null default now()
);

create table snip.clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references snip.links on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer_host text,
  device text,
  country text
);
create index on snip.clicks (link_id, clicked_at);

alter table snip.links enable row level security;
alter table snip.clicks enable row level security;

create policy "own links" on snip.links for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "own clicks" on snip.clicks for select
  using (exists (select 1 from snip.links l where l.id = link_id and l.owner_id = auth.uid()));

-- Called by the public redirect route: records the click and returns the target URL.
create function snip.resolve_link(p_slug text, p_referrer text, p_device text, p_country text)
returns text language plpgsql security definer set search_path = '' as $$
declare l snip.links;
begin
  select * into l from snip.links where slug = p_slug;
  if not found then return null; end if;
  insert into snip.clicks (link_id, referrer_host, device, country) values (l.id, p_referrer, p_device, p_country);
  return l.url;
end $$;
grant execute on function snip.resolve_link to anon, authenticated;

-- Table access is still governed by the RLS policies above.
grant all on all tables in schema snip to anon, authenticated, service_role;
grant all on all sequences in schema snip to anon, authenticated, service_role;
grant execute on all functions in schema snip to anon, authenticated, service_role;
