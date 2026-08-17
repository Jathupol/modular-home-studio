import { createFileRoute } from "@tanstack/react-router";
import { ContactCTA, FaqSection, PageHero } from "@/components/site/sections";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "คำถามที่พบบ่อยเรื่องบ้านน็อคดาวน์ | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content: "รวมคำถามที่พบบ่อย เรื่องราคา การขออนุญาต ฐานราก ระยะเวลาผลิตและติดตั้ง การรับประกัน และการชำระเงิน",
      },
      { property: "og:title", content: "คำถามที่พบบ่อยเรื่องบ้านน็อคดาวน์" },
      { property: "og:description", content: "คำตอบสำหรับข้อสงสัยก่อนตัดสินใจสั่งซื้อบ้านน็อคดาวน์" },
    ],
  }),
  component: () => (
    <>
      <PageHero
        eyebrow="FAQ"
        title="คำถามที่พบบ่อย"
        description="หากไม่พบคำตอบที่ต้องการ ทีมงานของเรายินดีให้คำปรึกษาโดยตรง"
      />
      <FaqSection />
      <ContactCTA />
    </>
  ),
});
