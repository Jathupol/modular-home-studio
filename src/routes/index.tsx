import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/site/ModelCard";
import { useQuote } from "@/components/site/QuoteProvider";
import {
  ContactCTA,
  FaqSection,
  PortfolioGallery,
  ProcessTimeline,
  ReviewsSection,
  SectionHeading,
  StatsBand,
  UsageCards,
  WhyUs,
} from "@/components/site/sections";
import { modelsQuery, settingsQuery } from "@/lib/site-data";
import { BadgeCheck, Factory, PackageCheck, Timer, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "บ้านน็อคดาวน์ ดีไซน์สวย พร้อมติดตั้ง | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content:
          "บ้านน็อคดาวน์และบ้านสำเร็จรูป ผลิตจากโรงงาน เลือกแบบบ้าน ดูราคาเริ่มต้น คำนวณราคาประมาณการ และขอใบเสนอราคาออนไลน์ บริการขนส่งและติดตั้งทั่วประเทศ",
      },
      { property: "og:title", content: "บ้านน็อคดาวน์ ดีไซน์สวย พร้อมติดตั้ง | คาซ่า น็อคดาวน์" },
      {
        property: "og:description",
        content: "เลือกแบบบ้านที่ใช่ คำนวณราคาประมาณการ และขอใบเสนอราคาได้ในไม่กี่ขั้นตอน",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HomeAndConstructionBusiness",
          name: "คาซ่า น็อคดาวน์",
          description: "ผู้ผลิตบ้านน็อคดาวน์และบ้านสำเร็จรูป พร้อมบริการขนส่งและติดตั้ง",
          areaServed: "TH",
        }),
      },
    ],
  }),
  component: Home,
});

const HIGHLIGHTS = [
  { icon: Factory, label: "ผลิตจากโรงงาน" },
  { icon: Timer, label: "ติดตั้งรวดเร็ว" },
  { icon: Wrench, label: "เลือกแบบและออปชันได้" },
  { icon: PackageCheck, label: "ขนส่งและติดตั้งครบวงจร" },
  { icon: BadgeCheck, label: "รับประกันสินค้า" },
];

function Home() {
  const { data: models = [] } = useQuery(modelsQuery);
  const { data: settings = {} } = useQuery(settingsQuery);
  const { openQuote } = useQuote();

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img
          src="/images/hero.jpg"
          alt="บ้านน็อคดาวน์ดีไซน์โมเดิร์นพร้อมระเบียงไม้ในสวน"
          width={1600}
          height={1008}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/20" />
        <div className="container-x flex min-h-[86vh] flex-col justify-center py-20 text-primary-foreground">
          <p className="fade-up eyebrow">Prefab House Studio</p>
          <h1 className="fade-up mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            บ้านน็อคดาวน์ ดีไซน์สวย พร้อมติดตั้ง
          </h1>
          <p className="fade-up mt-5 max-w-xl text-lg text-primary-foreground/85">
            เลือกแบบที่ใช่สำหรับคุณ พร้อมบริการให้คำปรึกษา ผลิต ขนส่ง และติดตั้ง
          </p>
          <div className="fade-up mt-9 flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/models">ดูแบบบ้านทั้งหมด</Link>
            </Button>
            <Button size="lg" variant="secondary" onClick={() => openQuote()}>
              ขอใบเสนอราคา
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href={`tel:${settings["phone"] ?? ""}`}>ปรึกษาเรา</a>
            </Button>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-card">
        <div className="container-x grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
          {HIGHLIGHTS.map((h) => (
            <div key={h.label} className="flex items-center gap-3 text-sm">
              <h.icon className="h-5 w-5 text-secondary" />
              {h.label}
            </div>
          ))}
        </div>
      </div>

      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="About us"
              title="บ้านที่ออกแบบมาเพื่อการใช้งานจริง"
              description="เราผลิตบ้านน็อคดาวน์ด้วยโครงสร้างเหล็กและระบบผนังสำเร็จรูปจากโรงงานของเราเอง ทุกหลังผ่านการตรวจคุณภาพก่อนขนส่ง ทีมติดตั้งของเราดูแลตั้งแต่ปรับพื้นที่จนส่งมอบกุญแจ"
            />
            {settings["promotion"] ? (
              <p className="mt-6 inline-block rounded-full bg-secondary/15 px-4 py-2 text-sm text-secondary-foreground">
                {settings["promotion"]}
              </p>
            ) : null}
          </div>
          <StatsBand />
        </div>
      </section>

      <section className="section-y bg-card">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Catalog" title="แบบบ้านน็อคดาวน์ของเรา" />
            <Button asChild variant="outline">
              <Link to="/models">ดูทั้งหมดและกรองแบบบ้าน</Link>
            </Button>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {models.slice(0, 3).map((m) => (
              <ModelCard key={m.id} model={m} />
            ))}
          </div>
        </div>
      </section>

      <WhyUs />
      <UsageCards />
      <ProcessTimeline />
      <PortfolioGallery limit={3} />
      <ReviewsSection />
      <FaqSection />
      <ContactCTA />
    </>
  );
}
