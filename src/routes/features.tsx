import { createFileRoute } from "@tanstack/react-router";
import { ContactCTA, PageHero, StatsBand, UsageCards, WhyUs } from "@/components/site/sections";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "จุดเด่นบ้านน็อคดาวน์ของเรา | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content: "โครงสร้างเหล็กแข็งแรง ผลิตจากโรงงาน ควบคุมคุณภาพทุกหลัง ติดตั้งรวดเร็ว พร้อมรับประกันงานและบริการหลังการขาย",
      },
      { property: "og:title", content: "จุดเด่นบ้านน็อคดาวน์ของเรา" },
      { property: "og:description", content: "ทำไมลูกค้าถึงเลือกบ้านน็อคดาวน์จากเรา" },
    ],
  }),
  component: () => (
    <>
      <PageHero
        eyebrow="Why us"
        title="จุดเด่นของบ้านน็อคดาวน์จากเรา"
        description="ทุกหลังผลิตในโรงงานภายใต้มาตรฐานเดียวกัน ตรวจสอบคุณภาพก่อนขนส่ง และติดตั้งโดยทีมงานของเราเอง"
      />
      <WhyUs />
      <div className="container-x pb-16">
        <StatsBand />
      </div>
      <UsageCards />
      <ContactCTA />
    </>
  ),
});
