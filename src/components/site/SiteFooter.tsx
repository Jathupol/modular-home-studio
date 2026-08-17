import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "@/lib/site-data";

export function SiteFooter() {
  const { data: s = {} } = useQuery(settingsQuery);

  return (
    <footer className="mt-8 border-t border-border bg-card">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold">คาซ่า น็อคดาวน์</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            ผู้ผลิตบ้านน็อคดาวน์และบ้านสำเร็จรูป ให้บริการตั้งแต่ให้คำปรึกษา ผลิต ขนส่ง
            ติดตั้ง และบริการหลังการขาย
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{s['address']}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">เมนู</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/models">แบบบ้าน</Link>
            </li>
            <li>
              <Link to="/portfolio">ผลงาน</Link>
            </li>
            <li>
              <Link to="/process">ขั้นตอนการสั่งซื้อ</Link>
            </li>
            <li>
              <Link to="/faq">คำถามที่พบบ่อย</Link>
            </li>
            <li>
              <Link to="/contact">ติดต่อเรา</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">ติดต่อ</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              โทร: <a href={`tel:${s['phone'] ?? ""}`}>{s['phone']}</a>
            </li>
            <li>LINE: {s['line_id']}</li>
            {s['facebook'] ? (
              <li>
                <a href={s['facebook']} target="_blank" rel="noreferrer noopener">
                  Facebook
                </a>
              </li>
            ) : null}
            {s['tiktok'] ? (
              <li>
                <a href={s['tiktok']} target="_blank" rel="noreferrer noopener">
                  TikTok
                </a>
              </li>
            ) : null}
            <li>
              <Link to="/admin" className="text-xs">
                สำหรับผู้ดูแลระบบ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} คาซ่า น็อคดาวน์ — บ้านน็อคดาวน์ บ้านสำเร็จรูป พร้อมติดตั้งทั่วประเทศ
      </div>
    </footer>
  );
}
