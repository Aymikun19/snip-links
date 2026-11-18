-- Pause a link or give it an expiry date; resolve_link returns a sentinel instead of the URL.
alter table snip.links add column if not exists active boolean not null default true;
alter table snip.links add column if not exists expires_at timestamptz;

create or replace function snip.resolve_link(p_slug text, p_referrer text, p_device text, p_country text)
returns text language plpgsql security definer set search_path = '' as $$
declare l snip.links;
begin
  select * into l from snip.links where slug = p_slug;
  if not found then return null; end if;
  if not l.active then return '!paused'; end if;
  if l.expires_at is not null and l.expires_at <= now() then return '!expired'; end if;
  insert into snip.clicks (link_id, referrer_host, device, country) values (l.id, p_referrer, p_device, p_country);
  return l.url;
end $$;
grant execute on function snip.resolve_link to anon, authenticated;
