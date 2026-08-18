
create type public.app_role as enum ('admin','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.set_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.house_models (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  code text not null,
  name text not null,
  tagline text,
  description text,
  width_m numeric not null default 3,
  length_m numeric not null default 6,
  area_sqm numeric not null default 18,
  bedrooms int not null default 1,
  bathrooms int not null default 1,
  base_price numeric not null default 0,
  materials text,
  production_days int not null default 30,
  install_days int not null default 3,
  cover_image text,
  usages text[] not null default '{}',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.house_models to anon;
grant select, insert, update, delete on public.house_models to authenticated;
grant all on public.house_models to service_role;
alter table public.house_models enable row level security;
create policy "public read models" on public.house_models for select to anon, authenticated using (is_published or public.has_role(auth.uid(),'admin'));
create policy "admin manage models" on public.house_models for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create trigger t_models_updated before update on public.house_models for each row execute function public.set_updated_at();

create table public.model_images (
  id uuid primary key default gen_random_uuid(),
  model_id uuid not null references public.house_models(id) on delete cascade,
  url text not null,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.model_images to anon;
grant select, insert, update, delete on public.model_images to authenticated;
grant all on public.model_images to service_role;
alter table public.model_images enable row level security;
create policy "public read model images" on public.model_images for select to anon, authenticated using (true);
create policy "admin manage model images" on public.model_images for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.house_options (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric not null default 0,
  description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.house_options to anon;
grant select, insert, update, delete on public.house_options to authenticated;
grant all on public.house_options to service_role;
alter table public.house_options enable row level security;
create policy "public read options" on public.house_options for select to anon, authenticated using (true);
create policy "admin manage options" on public.house_options for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  province text,
  model_name text,
  size_text text,
  install_time text,
  category text not null default 'บ้านพัก',
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "public read projects" on public.projects for select to anon, authenticated using (true);
create policy "admin manage projects" on public.projects for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  province text,
  model_name text,
  rating int not null default 5,
  content text not null,
  avatar_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.reviews to anon;
grant select, insert, update, delete on public.reviews to authenticated;
grant all on public.reviews to service_role;
alter table public.reviews enable row level security;
create policy "public read reviews" on public.reviews for select to anon, authenticated using (true);
create policy "admin manage reviews" on public.reviews for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.faqs to anon;
grant select, insert, update, delete on public.faqs to authenticated;
grant all on public.faqs to service_role;
alter table public.faqs enable row level security;
create policy "public read faqs" on public.faqs for select to anon, authenticated using (true);
create policy "admin manage faqs" on public.faqs for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);
grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;
alter table public.site_settings enable row level security;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin manage settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  line_id text,
  email text,
  province text,
  model_id uuid references public.house_models(id) on delete set null,
  model_name text,
  quantity int not null default 1,
  selected_options text[] not null default '{}',
  budget text,
  install_date date,
  message text,
  attachments text[] not null default '{}',
  estimated_price numeric,
  status text not null default 'รอติดต่อ',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.leads to anon;
grant select, insert, update, delete on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "anyone can submit lead" on public.leads for insert to anon, authenticated with check (true);
create policy "admin read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update leads" on public.leads for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete leads" on public.leads for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create trigger t_leads_updated before update on public.leads for each row execute function public.set_updated_at();

create policy "anyone upload site media" on storage.objects for insert to anon, authenticated with check (bucket_id = 'site-media');
create policy "admin read site media" on storage.objects for select to authenticated using (bucket_id = 'site-media' and public.has_role(auth.uid(),'admin'));

insert into public.site_settings (key, value) values
 ('phone','0800092139'),
 ('line_id','@080-009-21939'),
 ('facebook','Phanthila Rueanpid'),
 ('tiktok','https://tiktok.com'),
 ('address','-------------'),
 ('stat_delivered','480'),
 ('stat_years','12'),
 ('stat_provinces','62'),
 ('stat_models','24'),
 ('promotion','ฟรีค่าขนส่งในระยะ 100 กม. สำหรับการสั่งซื้อภายในเดือนนี้'),
 ('transport_rate_per_km','35'),
 ('install_fee','15000');

insert into public.house_options (name, price, sort_order) values
 ('ห้องน้ำเพิ่ม', 45000, 1),
 ('ระเบียง', 28000, 2),
 ('กันสาด', 18000, 3),
 ('แอร์', 16500, 4),
 ('เครื่องทำน้ำอุ่น', 6500, 5),
 ('ชุดครัว', 32000, 6),
 ('เฟอร์นิเจอร์บิลท์อิน', 55000, 7),
 ('เพิ่มขนาดบ้าน 1 เมตร', 48000, 8);

insert into public.house_models (slug, code, name, tagline, description, width_m, length_m, area_sqm, bedrooms, bathrooms, base_price, materials, production_days, install_days, cover_image, usages, sort_order) values
 ('model-a','KD-A01','บ้านรุ่น A','บ้านหลังเล็กสำหรับเริ่มต้น','บ้านน็อคดาวน์ขนาดกะทัดรัด เหมาะกับบ้านสวนและห้องพักให้เช่า ผลิตจากโรงงานพร้อมติดตั้งหน้างาน',3,6,18,1,1,189000,'โครงเหล็กกัลวาไนซ์ ผนังไฟเบอร์ซีเมนต์บุฉนวน หลังคาเมทัลชีท',25,2,'/images/model-a.jpg','{บ้านสวน,ห้องพัก}',1),
 ('model-b','KD-B01','บ้านรุ่น B','พื้นที่ใช้สอยลงตัว','บ้านน็อคดาวน์ขนาด 4x6 เมตร เพิ่มพื้นที่ห้องนั่งเล่น เหมาะกับบ้านพักตากอากาศและโฮมสเตย์',4,6,24,1,1,259000,'โครงเหล็กกัลวาไนซ์ ผนังไฟเบอร์ซีเมนต์บุฉนวน พื้นลามิเนต',30,3,'/images/model-b.jpg','{บ้านสวน,รีสอร์ท}',2),
 ('model-c','KD-C01','บ้านรุ่น C','สไตล์รีสอร์ทพร้อมระเบียง','บ้านน็อคดาวน์พร้อมระเบียงกว้าง ดีไซน์โมเดิร์น เหมาะกับรีสอร์ทและโฮมสเตย์ระดับพรีเมียม',4,8,32,2,1,389000,'โครงเหล็กกัลวาไนซ์ ผนังสำเร็จรูปบุฉนวนกันความร้อน กระจกเทมเปอร์',35,4,'/images/model-c.jpg','{รีสอร์ท,"Pool Villa"}',3),
 ('model-d','KD-D01','บ้านรุ่น D','สำหรับสำนักงานและร้านค้า','อาคารสำเร็จรูปดีไซน์เรียบหรู เหมาะกับออฟฟิศหน้าไซต์งาน ร้านกาแฟ และร้านค้า',4,10,40,1,1,459000,'โครงเหล็กกัลวาไนซ์ ผนังสำเร็จรูป กระจกบานใหญ่',40,4,'/images/model-d.jpg','{สำนักงาน,ร้านค้า}',4);

insert into public.model_images (model_id, url, caption, sort_order)
select id, cover_image, 'ด้านหน้า', 1 from public.house_models;
insert into public.model_images (model_id, url, caption, sort_order)
select id, '/images/interior.jpg', 'ภายใน', 2 from public.house_models;
insert into public.model_images (model_id, url, caption, sort_order)
select id, '/images/bedroom.jpg', 'ห้องนอน', 3 from public.house_models;
insert into public.model_images (model_id, url, caption, sort_order)
select id, '/images/floorplan.jpg', 'แปลนบ้าน', 4 from public.house_models;

insert into public.projects (title, province, model_name, size_text, install_time, category, image_url, sort_order) values
 ('บ้านสวนริมคลอง','นครปฐม','บ้านรุ่น B','4 × 6 ม.','3 วัน','บ้านสวน','/images/project-1.jpg',1),
 ('รีสอร์ท 6 หลัง เขาใหญ่','นครราชสีมา','บ้านรุ่น C','4 × 8 ม.','12 วัน','รีสอร์ท','/images/project-2.jpg',2),
 ('คาเฟ่ริมทะเล','ประจวบคีรีขันธ์','บ้านรุ่น D','4 × 10 ม.','5 วัน','ร้านค้า','/images/project-3.jpg',3),
 ('บ้านพักพนักงานโรงงาน','ระยอง','บ้านรุ่น A','3 × 6 ม.','8 วัน','บ้านพัก','/images/project-4.jpg',4);

insert into public.reviews (customer_name, province, model_name, rating, content, sort_order) values
 ('คุณธนพล ศรีสุข','เชียงใหม่','บ้านรุ่น B',5,'ทีมงานให้คำปรึกษาดีมาก ติดตั้งเสร็จภายใน 3 วัน งานเก็บรายละเอียดเรียบร้อยเกินคาด',1),
 ('คุณพิมพ์ชนก วัฒนกิจ','ประจวบคีรีขันธ์','บ้านรุ่น C',5,'สั่งทำรีสอร์ท 4 หลัง ราคาชัดเจนตั้งแต่แรก ไม่มีบานปลาย ลูกค้าที่มาพักชมว่าสวย',2),
 ('คุณอนุชา เรืองฤทธิ์','ระยอง','บ้านรุ่น A',5,'คุ้มค่ามากสำหรับบ้านพักคนงาน แข็งแรง เย็นกว่าที่คิด บริการหลังการขายตอบไว',3);

insert into public.faqs (question, answer, sort_order) values
 ('บ้านน็อคดาวน์คืออะไร?','บ้านสำเร็จรูปที่ผลิตชิ้นส่วนจากโรงงานแล้วนำมาประกอบติดตั้งที่หน้างาน ทำให้ควบคุมคุณภาพและระยะเวลาได้ดีกว่าการก่อสร้างทั่วไป',1),
 ('บ้านน็อคดาวน์แข็งแรงไหม?','ใช้โครงเหล็กกัลวาไนซ์และผนังสำเร็จรูปที่ผ่านมาตรฐานการผลิต รองรับการใช้งานระยะยาวและสภาพอากาศเมืองไทย',2),
 ('ใช��เวลากี่วันในการติดตั้ง?','โดยทั่วไป 2–5 วันต่อหลัง ขึ้นอยู่กับขนาดบ้านและความพร้อมของพื้นที่',3),
 ('บ้านสามารถย้ายได้หรือไม่?','บางรุ่นสามารถเคลื่อนย้ายได้ โดยต้องประเมินโครงสร้างและฐานรากก่อนย้ายทุกครั้ง',4),
 ('ต้องเตรียมพื้นที่อย่างไร?','ปรับพื้นที่ให้เรียบ รถบรรทุกเข้าถึงได้ และเตรียมจุดเชื่อมต่อไฟฟ้า–ประปา',5),
 ('ราคาบ้านรวมค่าขนส่งหรือไม่?','ราคาเริ่มต้นยังไม่รวมค่าขนส่ง ค่าขนส่งคำนวณตามระยะทางจริงจากโรงงาน',6),
 ('ราคาบ้านรวมฐานรากหรือไม่?','ยังไม่รวมงานฐานราก ทีมงานจะประเมินให้หลังสำรวจพื้นที่',7),
 ('มีรับประกันหรือไม่?','รับประกันโครงสร้าง 3 ปี และงานระบบ 1 ปี',8),
 ('สามารถออกแบบบ้านเองได้หรือไม่?','ได้ ส่งแบบหรือขนาดพื้นที่มาให้ทีมงานประเมินและออกแบบร่วมกันได้',9),
 ('สามารถสั่งหลายหลังสำหรับรีสอร์ทได้หรือไม่?','ได้ มีราคาพิเศษสำหรับโครงการตั้งแต่ 3 หลังขึ้นไป',10);
