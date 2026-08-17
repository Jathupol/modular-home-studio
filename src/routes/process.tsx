import { createFileRoute } from "@tanstack/react-router";
import { ContactCTA, PageHero, ProcessTimeline } from "@/components/site/sections";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "ขั้นตอนการสั่งซื้อบ้านน็อคดาวน์ | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content: "ตั้งแต่เลือกแบบบ้าน ขอใบเสนอราคา ทำสัญญา ผลิต ขนส่ง ติดตั้ง จนถึงส่งมอบและรับประกัน ดูขั้นตอนทั้งหมดแบบชัดเจน",
      },
      { property: "og:title", content: "ขั้นตอนการสั่งซื้อบ้านน็อคดาวน์" },
      { property: "og:description", content: "รู้ทุกขั้นตอนตั้งแต่เลือกแบบจนถึงวันส่งมอบบ้าน" },
    ],
  }),
  component: () => (
    <>
      <PageHero
        eyebrow="Process"
        title="ขั้นตอนการสั่งซื้อ"
        description="เราออกแบบขั้นตอนให้เข้าใจง่ายและตรวจสอบได้ทุกช่วง พร้อมแจ้งความคืบหน้าตลอดโครงการ"
      />
      <ProcessTimeline />
      <ContactCTA />
    </>
  ),
});
