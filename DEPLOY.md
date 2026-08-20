# คู่มือย้ายฐานข้อมูล / Backup / Deploy เอง

โปรเจกต์นี้เป็นซอร์สโค้ดของคุณทั้งหมด (Frontend = React + TanStack Start,
Backend = server functions ในโฟลเดอร์ `src/`, Database = PostgreSQL)
ทุกการเชื่อมต่ออ่านจาก environment variables จึงย้ายที่ได้โดยไม่ต้องแก้โค้ด

## 1. ไฟล์สำคัญ

| ไฟล์ | หน้าที่ |
| --- | --- |
| `db/schema.sql` | โครงสร้างตาราง + สิทธิ์ (GRANT) + RLS + ข้อมูลตั้งต้นทั้งหมด |
| `scripts/db.sh` | ติดตั้ง / สำรอง / กู้คืนฐานข้อมูล |
| `docker-compose.yml` | รัน PostgreSQL ของตัวเอง |
| `.env.example` | ตัวแปรทั้งหมดที่ระบบใช้ |

> `db/schema.sql` รันได้ทั้งบน Supabase และ PostgreSQL ธรรมดา
> (มีส่วนหัวที่สร้าง role `anon/authenticated/service_role` และ `auth.uid()` ให้อัตโนมัติ
> ส่วน policy ของ Storage จะถูกข้ามถ้าไม่ใช่ Supabase)

## 2. เตรียมเครื่องมือ

```bash
# macOS
brew install postgresql@16
# Ubuntu/Debian
sudo apt install -y postgresql-client
chmod +x scripts/db.sh
cp .env.example .env   # แล้วใส่ค่าจริง
```

## 3. สำรองข้อมูลจากฐานข้อมูลปัจจุบัน

ตั้ง `DATABASE_URL` เป็น connection string ของฐานข้อมูลปัจจุบัน แล้ว:

```bash
./scripts/db.sh backup      # ได้ backups/backup-<เวลา>.dump และ .sql
./scripts/db.sh dump-data   # เฉพาะข้อมูล (INSERT)
```

แนะนำให้ตั้ง cron รายวัน:
```
0 2 * * * cd /path/to/project && ./scripts/db.sh backup >> backups/cron.log 2>&1
```

## 4. ย้ายไปฐานข้อมูลใหม่ (ที่ไหนก็ได้)

ตัวเลือกฐานข้อมูล: Supabase self-host, Neon, Railway, Render, AWS RDS,
DigitalOcean หรือ Docker บน VPS ของคุณเอง

```bash
export DATABASE_URL="postgresql://user:pass@new-host:5432/dbname?sslmode=require"
./scripts/db.sh init                              # สร้างโครงสร้าง + ข้อมูลตั้งต้น
./scripts/db.sh restore backups/backup-xxx.dump   # หรือกู้ข้อมูลเดิมทั้งหมด
./scripts/db.sh check                             # ตรวจว่าตาราง/จำนวนแถวถูกต้อง
```

ใช้ Docker ในเครื่อง:
```bash
docker compose up -d
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/knockdown"
./scripts/db.sh check
```

## 5. รันเว็บเองและ Deploy ที่อื่น

```bash
npm install
npm run dev            # http://localhost:8080
npm run build          # ผลลัพธ์อยู่ใน .output/ (Nitro)
```

- **VPS / Docker:** `npm run build` แล้วรัน `node .output/server/index.mjs`
- **Cloudflare Workers / Vercel / Netlify:** เชื่อม repo แล้วตั้งค่า build `npm run build`
- ตั้ง environment variables ตาม `.env.example` ในแดชบอร์ดของผู้ให้บริการ
  (ตัวแปร `VITE_*` ต้องมีตอน build ส่วนตัวที่เหลือใช้ตอน runtime)

## 6. ส่วนที่เป็น Backend ในโค้ด

- `src/lib/*.functions.ts` — server functions (ทำงานฝั่งเซิร์ฟเวอร์)
- `src/routes/api/*` — HTTP endpoints (ถ้ามี) สำหรับ webhook/cron
- `src/integrations/supabase/*` — ตัวเชื่อมฐานข้อมูล (อ่านค่าจาก env)

แก้ไขได้ทั้งหมด ไม่มีส่วนที่ถูกล็อกไว้

## 7. Deploy บน Vercel

1. Import repo เข้า Vercel (Framework Preset: **Other** — ไฟล์ `vercel.json` ตั้งค่าให้แล้ว)
2. ตั้ง Environment Variables ใน Vercel (Settings > Environment Variables) ตาม `.env.example`:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` (ต้องมีตอน build)
   - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (runtime)
3. Deploy — build จะรัน `npm run build` และสร้างผลลัพธ์ที่ `.vercel/output`
   (vite.config.ts จะสลับเป็น nitro preset `vercel` อัตโนมัติเมื่อเจอตัวแปร `VERCEL`)

> ถ้า deploy ผ่าน Vercel แล้ว ไม่จำเป็นต้องใช้ GitHub Actions ของ Azure — workflow นั้นจะข้ามขั้นตอน deploy เองถ้าไม่ได้ตั้งค่า
