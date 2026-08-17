import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PriceCalculator } from "@/components/site/PriceCalculator";
import { useQuote } from "@/components/site/QuoteProvider";
import { modelImagesQuery, modelsQuery, optionsQuery, thb } from "@/lib/site-data";

export const Route = createFileRoute("/models/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `แบบบ้านน็อคดาวน์ ${params.slug.toUpperCase()} | คาซ่า น็อคดาวน์` },
      {
        name: "description",
        content:
          "รายละเอียดแบบบ้านน็อคดาวน์: ขนาด พื้นที่ใช้สอย ห้องนอน ห้องน้ำ วัสดุ ระยะเวลาผลิตและติดตั้ง พร้อมคำนวณราคาประมาณการและขอใบเสนอราคา",
      },
      { property: "og:title", content: "รายละเอียดแบบบ้านน็อคดาวน์ | คาซ่า น็อคดาวน์" },
      {
        property: "og:description",
        content: "ดูรูปหลายมุม แปลนบ้าน ออปชันเสริม และราคาประมาณการของแบบบ้านรุ่นนี้",
      },
    ],
  }),
  component: ModelDetail,
});

function ModelDetail() {
  const { slug } = Route.useParams();
  const { data: models = [] } = useQuery(modelsQuery);
  const { data: options = [] } = useQuery(optionsQuery);
  const model = models.find((m) => m.slug === slug);
  const { data: images = [] } = useQuery({
    ...modelImagesQuery(model?.id ?? ""),
    enabled: !!model?.id,
  });
  const { openQuote } = useQuote();
  const [selected, setSelected] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!model) {
    return (
      <div className="container-x section-y text-center">
        <p className="text-muted-foreground">กำลังโหลดข้อมูลแบบบ้าน…</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/models">กลับไปหน้าแบบบ้าน</Link>
        </Button>
      </div>
    );
  }

  const optionsTotal = options
    .filter((o) => selected.includes(o.id))
    .reduce((s, o) => s + Number(o.price), 0);
  const estimate = Number(model.base_price) + optionsTotal;
  const selectedNames = options.filter((o) => selected.includes(o.id)).map((o) => o.name);

  return (
    <>
      <section className="section-y">
        <div className="container-x grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <button
              className="zoom-media card-surface block w-full overflow-hidden"
              onClick={() => setLightbox(model.cover_image)}
            >
              <img
                src={model.cover_image ?? ""}
                alt={`${model.name} บ้านน็อคดาวน์ ${model.width_m} × ${model.length_m} เมตร`}
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
              />
            </button>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setLightbox(img.url)}
                  className="zoom-media card-surface overflow-hidden"
                >
                  <img
                    src={img.url}
                    alt={`${model.name} ${img.caption ?? ""}`}
                    loading="lazy"
                    width={400}
                    height={300}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">{model.code}</p>
            <h1 className="mt-2 text-4xl font-semibold">{model.name}</h1>
            <p className="mt-3 text-muted-foreground">{model.description}</p>

            <dl className="mt-7 grid grid-cols-2 gap-4 text-sm">
              <Spec label="ขนาด" value={`${model.width_m} × ${model.length_m} เมตร`} />
              <Spec label="พื้นที่ใช้สอย" value={`${model.area_sqm} ตร.ม.`} />
              <Spec label="ห้องนอน" value={`${model.bedrooms} ห้อง`} />
              <Spec label="ห้องน้ำ" value={`${model.bathrooms} ห้อง`} />
              <Spec label="ระยะเวลาผลิต" value={`${model.production_days} วัน`} />
              <Spec label="ระยะเวลาติดตั้ง" value={`${model.install_days} วัน`} />
              <div className="col-span-2">
                <Spec label="วัสดุ" value={model.materials ?? "-"} />
              </div>
            </dl>

            <div className="mt-8 card-surface p-6">
              <p className="text-sm text-muted-foreground">
                ราคาเริ่มต้น{" "}
                <span className="text-2xl font-semibold text-foreground">
                  {thb(model.base_price)}
                </span>{" "}
                บาท
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                ราคาสุดท้ายขึ้นอยู่กับวัสดุ ออปชัน ระยะทางขนส่ง และสภาพพื้นที่ติดตั้ง
              </p>

              <p className="mt-6 text-sm font-medium">เลือกออปชันเพิ่มเติม</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {options.map((o) => (
                  <label key={o.id} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selected.includes(o.id)}
                      onCheckedChange={(c) =>
                        setSelected((prev) =>
                          c ? [...prev, o.id] : prev.filter((id) => id !== o.id),
                        )
                      }
                    />
                    <span>
                      {o.name} <span className="text-muted-foreground">+{thb(o.price)} บ.</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-6 flex items-baseline justify-between border-t border-border pt-5">
                <span className="text-sm text-muted-foreground">ราคาประมาณการ (ไม่รวมขนส่ง)</span>
                <span className="text-2xl font-semibold">{thb(estimate)} บาท</span>
              </div>

              <Button
                size="lg"
                className="mt-6 w-full"
                onClick={() => openQuote({ model, options: selectedNames, estimated: estimate })}
              >
                สั่งจองบ้านรุ่นนี้
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PriceCalculator modelId={model.id} />

      <Dialog open={!!lightbox} onOpenChange={(v) => !v && setLightbox(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="sr-only">{model.name}</DialogTitle>
          {lightbox ? (
            <img src={lightbox} alt={model.name} className="w-full rounded-xl object-contain" />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
