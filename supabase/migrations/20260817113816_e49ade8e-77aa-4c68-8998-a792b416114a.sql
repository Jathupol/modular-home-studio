
drop policy "public read models" on public.house_models;
create policy "anon read published models" on public.house_models for select to anon using (is_published);
create policy "auth read models" on public.house_models for select to authenticated using (is_published or public.has_role(auth.uid(),'admin'));
revoke execute on function public.has_role(uuid, public.app_role) from anon, public;
