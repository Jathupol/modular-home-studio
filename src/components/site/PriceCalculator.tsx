import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { estimatePrice, modelsQuery, optionsQuery, settingsQuery, thb } from "@/lib/site-data";
import { SectionHeading } from "./sections";
import { useQuote } from "./QuoteProvider";

export function PriceCalculator({ modelId }: { modelId?: string }) {
  const { data: models = [] } = useQuery(modelsQuery);
  const { data: options = [] } = useQuery(optionsQuery);
  const { data: settings = {} } = useQuery(settingsQuery);
  const { openQuote } = useQuote();

  const [selectedModel, setSelectedModel] = useState(modelId ?? "");
  const [selected, setSelected] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [distance, setDistance] = useState(100);

  const model = models.find((m) => m.id === (modelId ?? selectedModel)) ?? models[0];
  const optionsTotal = options
    .filter((o) => selected.includes(o.id))
    .reduce((sum, o) => sum + Number(o.price), 0);

  const result = estimatePrice({
    basePrice: Number(model?.base_price ?? 0),
    optionsTotal,
    quantity,
    installFee: Number(settings["install_fee"] ?? 0),
    transportRatePerKm: Number(settings["transport_rate_per_km"] ?? 0),
    distanceKm: distance,
  });

  const selectedNames = options.filter((o) => selected.includes(o.id)).map((o) => o.name);

  return (
    <section className="section-y bg-card">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Calculator"
            title="คำนวณราคาโดยประมาณ"
            description="เลือกรุ่นบ้าน ออปชัน จำนวนหลัง และระยะทางขนส่ง เพื่อดูราคาประมาณการทันที"
          />
          <div className="mt-8 space-y-5">
            {!modelId ? (
              <div className="space-y-1.5">
                <Label>รุ่นบ้าน</Label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
                  value={model?.id ?? ""}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} · {m.width_m} × {m.length_m} ม.
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>จำนวนหลัง</Label>
                <Input
                  type="number"
                  min={1}
                  max={99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>ระยะทางขนส่ง (กม.)</Label>
                <Input
                  type="number"
                  min={0}
                  max={1500}
                  value={distance}
                  onChange={(e) => setDistance(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">ออปชันเพิ่มเติม</p>
              <div className="grid gap-2 sm:grid-cols-2">
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
            </div>
          </div>
        </div>

        <div className="card-surface h-fit p-7">
          <h3 className="text-lg font-semibold">ราคาประมาณการ</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="ราคาบ้าน" value={result.houses} />
            <Row label="ราคาออปชัน" value={result.options} />
            <Row label="ค่าขนส่งโดยประมาณ" value={result.transport} />
            <Row label="ค่าติดตั้ง" value={result.install} />
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
            <span className="text-sm text-muted-foreground">รวมประมาณการ</span>
            <span className="text-3xl font-semibold">{thb(result.total)} บาท</span>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            ราคานี้เป็นเพียงราคาประมาณการ ราคาจริงจะยืนยันโดยฝ่ายขายหลังตรวจสอบรายละเอียดและพื้นที่ติดตั้ง
          </p>
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() =>
              openQuote({ model: model ?? null, options: selectedNames, estimated: result.total })
            }
          >
            ส่งคำขอเสนอราคาตามนี้
          </Button>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{thb(value)} บาท</dd>
    </div>
  );
}
