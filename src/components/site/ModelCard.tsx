import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Maximize, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { thb, type HouseModel } from "@/lib/site-data";
import { useQuote } from "./QuoteProvider";

export function ModelCard({ model }: { model: HouseModel }) {
  const { openQuote } = useQuote();

  return (
    <article className="card-surface flex flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]">
      <Link
        to="/models/$slug"
        params={{ slug: model.slug }}
        className="zoom-media block aspect-[4/3] bg-muted"
      >
        {model.cover_image ? (
          <img
            src={model.cover_image}
            alt={`${model.name} บ้านน็อคดาวน์ ขนาด ${model.width_m} × ${model.length_m} เมตร`}
            loading="lazy"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{model.code}</p>
        <h3 className="mt-1 text-xl font-semibold">{model.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{model.tagline}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <Spec icon={<Ruler className="h-4 w-4" />} label={`${model.width_m} × ${model.length_m} ม.`} />
          <Spec icon={<Maximize className="h-4 w-4" />} label={`${model.area_sqm} ตร.ม.`} />
          <Spec icon={<BedDouble className="h-4 w-4" />} label={`${model.bedrooms} ห้องนอน`} />
          <Spec icon={<Bath className="h-4 w-4" />} label={`${model.bathrooms} ห้องน้ำ`} />
        </dl>

        <p className="mt-5 text-sm text-muted-foreground">
          ราคาเริ่มต้น{" "}
          <span className="text-lg font-semibold text-foreground">{thb(model.base_price)}</span> บาท
        </p>

        <div className="mt-5 flex gap-2 pt-1">
          <Button asChild className="flex-1">
            <Link to="/models/$slug" params={{ slug: model.slug }}>
              ดูรายละเอียด
            </Link>
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => openQuote({ model })}>
            ขอราคา
          </Button>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="text-secondary">{icon}</span>
      {label}
    </div>
  );
}
