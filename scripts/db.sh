#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# db.sh — เครื่องมือจัดการฐานข้อมูลของโปรเจกต์ (ใช้ได้จริงกับ PostgreSQL ทุกเจ้า)
#
#   ./scripts/db.sh init      # สร้างตาราง+สิทธิ์+ข้อมูลตั้งต้นจาก db/schema.sql
#   ./scripts/db.sh backup    # สำรองฐานข้อมูลทั้งก้อน -> backups/*.dump + *.sql
#   ./scripts/db.sh dump-data # สำรองเฉพาะข้อมูล (INSERT) -> backups/data-*.sql
#   ./scripts/db.sh restore <file>   # กู้คืนจากไฟล์ .dump หรือ .sql
#   ./scripts/db.sh psql      # เปิด psql เข้าฐานข้อมูล
#   ./scripts/db.sh check     # ทดสอบการเชื่อมต่อ + นับแถวแต่ละตาราง
#
# ต้องมีตัวแปร DATABASE_URL (ใส่ใน .env หรือ export เอง) เช่น
#   postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# โหลด .env ถ้ามี (ไม่ทับค่าที่ export ไว้แล้ว)
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

: "${DATABASE_URL:?ยังไม่ได้ตั้งค่า DATABASE_URL — ดูตัวอย่างใน .env.example}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "ไม่พบคำสั่ง '$1' กรุณาติดตั้ง postgresql-client ก่อน"; exit 1; }; }
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups

case "${1:-help}" in
  init)
    need psql
    echo "==> ติดตั้ง schema ลงฐานข้อมูลปลายทาง"
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/schema.sql
    echo "เสร็จแล้ว ✅"
    ;;

  backup)
    need pg_dump
    echo "==> สำรองฐานข้อมูล (schema public)"
    pg_dump "$DATABASE_URL" --schema=public --no-owner --no-privileges \
      -Fc -f "backups/backup-$STAMP.dump"
    pg_dump "$DATABASE_URL" --schema=public --no-owner --no-privileges \
      -f "backups/backup-$STAMP.sql"
    echo "ไฟล์: backups/backup-$STAMP.dump และ .sql ✅"
    ;;

  dump-data)
    need pg_dump
    echo "==> สำรองเฉพาะข้อมูล"
    pg_dump "$DATABASE_URL" --schema=public --data-only --column-inserts \
      --no-owner --no-privileges -f "backups/data-$STAMP.sql"
    echo "ไฟล์: backups/data-$STAMP.sql ✅"
    ;;

  restore)
    FILE="${2:?ระบุไฟล์ที่จะกู้คืน เช่น ./scripts/db.sh restore backups/backup-xxx.dump}"
    [ -f "$FILE" ] || { echo "ไม่พบไฟล์ $FILE"; exit 1; }
    case "$FILE" in
      *.dump) need pg_restore
              pg_restore --no-owner --no-privileges --clean --if-exists \
                -d "$DATABASE_URL" "$FILE" ;;
      *)      need psql
              psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$FILE" ;;
    esac
    echo "กู้คืนเรียบร้อย ✅"
    ;;

  psql)
    need psql
    exec psql "$DATABASE_URL"
    ;;

  check)
    need psql
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "select version();"
    psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -c "
      select table_name,
             (xpath('/row/c/text()',
               query_to_xml(format('select count(*) as c from public.%I', table_name),
                            false, true, '')))[1]::text::int as rows
      from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name;"
    ;;

  *)
    sed -n '2,20p' "$0"
    ;;
esac
