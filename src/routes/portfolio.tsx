import { createFileRoute } from "@tanstack/react-router";
import { ContactCTA, PageHero, PortfolioGallery } from "@/components/site/sections";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "ผลงานบ้านน็อคดาวน์ที่ส่งมอบจริง | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content: "รวมผลงานการติดตั้งบ้านน็อคดาวน์และบ้านสำเร็จรูปจากลูกค้าจริงทั่วประเทศ พร้อมรายละเอียดแบบบ้านและพื้นที่ติดตั้ง",
      },
      { property: "og:title", content: "ผลงานบ้านน็อคดาวน์ที่ส่งมอบจริง" },
      { property: "og:description", content: "ดูภาพผลงานการติดตั้งจริงของลูกค้าเราทั่วประเทศ" },
    ],
  }),
  component: () => (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="ผลงานที่ส่งมอบจริง"
        description="ภาพจากหน้างานจริงของลูกค้าเรา ทั้งบ้านพักอาศัย รีสอร์ต ร้านค้า และออฟฟิศสำนักงาน"
      />
      <PortfolioGallery />
      <ContactCTA />
    </>
  ),
});
