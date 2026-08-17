import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { modelsQuery, optionsQuery, thb, type HouseModel } from "@/lib/site-data";
import { CheckCircle2, Loader2 } from "lucide-react";

const schema = z.object({
  full_name: z.string().trim().min(2, "กรุณากรอกชื่อ-นามสกุล").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "เบอร์โทรศัพท์ไม่ถูกต้อง"),
  line_id: z.string().trim().max(60).optional().or(z.literal("")),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").max(255).optional().or(z.literal("")),
  province: z.string().trim().max(60).optional().or(z.literal("")),
  budget: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export function QuoteDialog({
  open,
  onOpenChange,
  model,
  presetOptions = [],
  estimated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  model?: HouseModel | null;
  presetOptions?: string[];
  estimated?: number | null;
}) {
  const { data: models = [] } = useQuery(modelsQuery);
  const { data: options = [] } = useQuery(optionsQuery);

  const [modelId, setModelId] = useState<string>(model?.id ?? "");
  const [selected, setSelected] = useState<string[]>(presetOptions);
  const [quantity, setQuantity] = useState(1);
  const [installDate, setInstallDate] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const activeModel = models.find((m) => m.id === (model?.id ?? modelId)) ?? model ?? null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd.entries()));
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง");
      return;
    }
    setSubmitting(true);
    try {
      const attachments: string[] = [];
      if (files) {
        for (const file of Array.from(files).slice(0, 5)) {
          const path = `leads/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
          const { error } = await supabase.storage.from("site-media").upload(path, file);
          if (!error) attachments.push(path);
        }
      }
      const v = parsed.data;
      const { error } = await supabase.from("leads").insert({
        full_name: v.full_name,
        phone: v.phone,
        line_id: v.line_id || null,
        email: v.email || null,
        province: v.province || null,
        model_id: activeModel?.id ?? null,
        model_name: activeModel?.name ?? null,
        quantity,
        selected_options: selected,
        budget: v.budget || null,
        install_date: installDate || null,
        message: v.message || null,
        attachments,
        estimated_price: estimated ?? null,
      });
      if (error) throw error;
      setDone(true);
    } catch {
      toast.error("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setDone(false);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {done ? (
          <div className="py-10 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
            <h3 className="mt-4 text-xl font-semibold">ส่งข้อมูลเรียบร้อยแล้ว</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดและเสนอราคาที่เหมาะสม
            </p>
            <Button className="mt-6" onClick={() => onOpenChange(false)}>
              ปิดหน้าต่าง
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>ขอใบเสนอราคา / สั่งจอง</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลเพื่อให้ทีมงานประเมินราคาและติดต่อกลับ
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="ชื่อ-นามสกุล *">
                  <Input name="full_name" required maxLength={100} />
                </Field>
                <Field label="เบอร์โทรศัพท์ *">
                  <Input name="phone" required maxLength={20} inputMode="tel" />
                </Field>
                <Field label="LINE ID">
                  <Input name="line_id" maxLength={60} />
                </Field>
                <Field label="อีเมล">
                  <Input name="email" type="email" maxLength={255} />
                </Field>
                <Field label="จังหวัดที่ติดตั้ง">
                  <Input name="province" maxLength={60} />
                </Field>
                <Field label="งบประมาณ">
                  <Input name="budget" maxLength={60} placeholder="เช่น 300,000 บาท" />
                </Field>
                <Field label="รุ่นบ้าน">
                  <select
                    className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
                    value={activeModel?.id ?? ""}
                    onChange={(e) => setModelId(e.target.value)}
                    disabled={!!model}
                  >
                    <option value="">ยังไม่ระบุ</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.code})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="จำนวนที่ต้องการ (หลัง)">
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  />
                </Field>
                <Field label="วันที่ต้องการติดตั้ง">
                  <Input
                    type="date"
                    value={installDate}
                    onChange={(e) => setInstallDate(e.target.value)}
                  />
                </Field>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium">ออปชันที่ต้องการ</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {options.map((o) => (
                    <label key={o.id} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={selected.includes(o.name)}
                        onCheckedChange={(c) =>
                          setSelected((prev) =>
                            c ? [...prev, o.name] : prev.filter((n) => n !== o.name),
                          )
                        }
                      />
                      <span>
                        {o.name}{" "}
                        <span className="text-muted-foreground">+{thb(o.price)} บ.</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <Field label="ข้อความเพิ่มเติม">
                <Textarea name="message" rows={3} maxLength={1000} />
              </Field>

              <Field label="แนบรูปพื้นที่หน้างาน / แบบบ้านที่มี (สูงสุด 5 ไฟล์)">
                <Input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => setFiles(e.target.files)}
                />
              </Field>

              {estimated ? (
                <p className="rounded-xl bg-muted p-3 text-sm">
                  ราคาประมาณการที่คำนวณไว้: <strong>{thb(estimated)} บาท</strong>
                </p>
              ) : null}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                ส่งคำขอเสนอราคา
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
