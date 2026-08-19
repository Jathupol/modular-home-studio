-- ---------------------------------------------------------------------------
-- Portability prelude: on a plain PostgreSQL server (Docker, RDS, Neon, ...)
-- the Supabase roles and auth.uid() do not exist. Create them if missing so the
-- rest of this file runs unchanged. On Supabase these blocks are no-ops.
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;

create schema if not exists auth;
do $$
begin
  if not exists (select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
                 where n.nspname = 'auth' and p.proname = 'uid') then
    execute $f$create function auth.uid() returns uuid language sql stable as
      'select nullif(current_setting(''request.jwt.claim.sub'', true), '''')::uuid'
    $f$;
  end if;
end $$;
