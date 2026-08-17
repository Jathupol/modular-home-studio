import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/sections";
import { useQuote } from "@/components/site/QuoteProvider";
import { settingsQuery } from "@/lib/site-data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "ติดต่อเรา | ขอใบเสนอราคาบ้านน็อคดาวน์ | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content: "ติดต่อทีมงานเพื่อขอคำปรึกษาและใบเสนอราคาบ้านน็อคดาวน์ พร้อมข้อมูลเบอร์โทร LINE อีเมล ที่ตั้งโรงงาน และเวลาทำการ",
      },
      { property: "og:title", content: "ติดต่อเรา | คาซ่า น็อคดาวน์" },
      { property: "og:description", content: "ปรึกษาทีมงานและขอใบเสนอราคาบ้านน็อคดาวน์ได้ทุกวัน" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings = {} } = useQuery(settingsQuery);
  const { openQuote } = useQuote();

  const items = [
    { label: "โทรศัพท์", value: settings["phone"], href: `tel:${settings["phone"] ?? ""}` },
    { label: "LINE", value: settings["line_id"], href: settings["line_url"] },
    { label: "อีเมล", value: settings["email"], href: `mailto:${settings["email"] ?? ""}` },
    { label: "ที่ตั้ง", value: settings["address"] },
    { label: "เวลาทำการ", value: settings["hours"] },
  ].filter((i) => i.value);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="ติดต่อเรา"
        description="ทีมงานพร้อมให้คำปรึกษาเรื่องแบบบ้าน งบประมาณ และการเตรียมพื้นที่ติดตั้ง"
      />
      <section className="section-y">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <dl className="card-surface divide-y divide-border p-2">
            {items.map((i) => (
              <div key={i.label} className="flex items-start justify-between gap-6 p-5">
                <dt className="text-sm text-muted-foreground">{i.label}</dt>
                <dd className="text-right text-sm font-medium">
                  {i.href ? (
                    <a href={i.href} className="hover:text-secondary">
                      {i.value}
                    </a>
                  ) : (
                    i.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="card-surface flex flex-col justify-center p-8">
            <h2 className="text-2xl font-semibold">ขอใบเสนอราคาออนไลน์</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              กรอกข้อมูลสั้น ๆ พร้อมแนบไฟล์แบบหรือรูปพื้นที่ติดตั้ง ทีมงานจะติดต่อกลับภายใน 1 วันทำการ
            </p>
            <Button size="lg" className="mt-6" onClick={() => openQuote()}>
              เปิดแบบฟอร์มขอใบเสนอราคา
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
