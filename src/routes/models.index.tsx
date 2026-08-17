import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ModelCard } from "@/components/site/ModelCard";
import { PageHero } from "@/components/site/sections";
import { PriceCalculator } from "@/components/site/PriceCalculator";
import { Slider } from "@/components/ui/slider";
import { modelsQuery, thb, USAGE_TAGS } from "@/lib/site-data";

export const Route = createFileRoute("/models/")({
  head: () => ({
    meta: [
      { title: "แบบบ้านน็อคดาวน์ทั้งหมด | ราคาเริ่มต้นและขนาด | คาซ่า น็อคดาวน์" },
      {
        name: "description",
        content:
          "รวมแบบบ้านน็อคดาวน์และบ้านสำเร็จรูปทุกรุ่น กรองตามงบประมาณ ขนาด จำนวนห้องนอน ห้องน้ำ และลักษณะการใช้งาน พร้อมราคาเริ่มต้นแต่ละรุ่น",
      },
      { property: "og:title", content: "แบบบ้านน็อคดาวน์ทั้งหมด | คาซ่า น็อคดาวน์" },
      {
        property: "og:description",
        content: "เลือกแบบบ้านน็อคดาวน์ตามงบประมาณและการใช้งาน พร้อมคำนวณราคาประมาณการ",
      },
    ],
  }),
  component: ModelsPage,
});

function ModelsPage() {
  const { data: models = [] } = useQuery(modelsQuery);
  const [budget, setBudget] = useState(1000000);
  const [minArea, setMinArea] = useState(0);
  const [beds, setBeds] = useState(0);
  const [baths, setBaths] = useState(0);
  const [usage, setUsage] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      models.filter(
        (m) =>
          m.base_price <= budget &&
          m.area_sqm >= minArea &&
          (beds === 0 || m.bedrooms >= beds) &&
          (baths === 0 || m.bathrooms >= baths) &&
          (!usage || m.usages.includes(usage)),
      ),
    [models, budget, minArea, beds, baths, usage],
  );

  return (
    <>
      <PageHero
        eyebrow="Catalog"
        title="แบบบ้านน็อคดาวน์ของเรา"
        description="เลือกแบบบ้านที่เหมาะกับงบประมาณและการใช้งานของคุณ กรองผลลัพธ์ได้ทันทีโดยไม่ต้องโหลดหน้าใหม่"
      />

      <section className="section-y">
        <div className="container-x grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="card-surface h-fit space-y-6 p-6 lg:sticky lg:top-24">
            <div>
              <p className="text-sm font-medium">งบประมาณสูงสุด</p>
              <p className="mt-1 text-sm text-muted-foreground">{thb(budget)} บาท</p>
              <Slider
                className="mt-3"
                min={100000}
                max={1000000}
                step={10000}
                value={[budget]}
                onValueChange={(v) => setBudget(v[0] ?? budget)}
              />
            </div>
            <div>
              <p className="text-sm font-medium">พื้นที่ใช้สอยขั้นต่ำ</p>
              <p className="mt-1 text-sm text-muted-foreground">{minArea} ตร.ม.</p>
              <Slider
                className="mt-3"
                min={0}
                max={60}
                step={2}
                value={[minArea]}
                onValueChange={(v) => setMinArea(v[0] ?? 0)}
              />
            </div>
            <FilterRow label="ห้องนอน" value={beds} onChange={setBeds} />
            <FilterRow label="ห้องน้ำ" value={baths} onChange={setBaths} />
            <div>
              <p className="mb-2 text-sm font-medium">ลักษณะการใช้งาน</p>
              <div className="flex flex-wrap gap-2">
                {USAGE_TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setUsage(usage === t ? null : t)}
                    className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                      usage === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:border-secondary"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <p className="mb-5 text-sm text-muted-foreground">พบ {filtered.length} แบบบ้าน</p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((m) => (
                <ModelCard key={m.id} model={m} />
              ))}
            </div>
            {filtered.length === 0 ? (
              <p className="card-surface p-10 text-center text-sm text-muted-foreground">
                ไม่พบแบบบ้านตามเงื่อนไข ลองปรับตัวกรองใหม่อีกครั้ง
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <PriceCalculator />
    </>
  );
}

function FilterRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={`h-9 flex-1 rounded-lg border text-sm transition-colors ${
              value === n
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-secondary"
            }`}
          >
            {n === 0 ? "ทั้งหมด" : `${n}+`}
          </button>
        ))}
      </div>
    </div>
  );
}
