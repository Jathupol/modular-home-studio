import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Factory,
  Timer,
  Wallet,
  Ruler,
  SlidersHorizontal,
  LifeBuoy,
  Star,
  Phone,
  MessageCircle,
} from "lucide-react";
import { faqsQuery, projectsQuery, reviewsQuery, settingsQuery } from "@/lib/site-data";
import { useQuote } from "./QuoteProvider";

export function SectionHeading({
  eyebrow,
  title,
  description,
  center,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="border-b border-border bg-card">
      <div className="container-x py-14 md:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">{description}</p>
      </div>
    </section>
  );
}

const WHY = [
  { icon: Factory, title: "ผลิตจากโรงงาน", text: "ควบคุมคุณภาพทุกชิ้นส่วนและลดระยะเวลาหน้างาน" },
  { icon: Timer, title: "ติดตั้งรวดเร็ว", text: "ลดเวลาการก่อสร้างเมื่อเทียบกับการก่อสร้างแบบทั่วไป" },
  { icon: Wallet, title: "ควบคุมงบประมาณ", text: "เห็นรายละเอียดและออปชันทั้งหมดก่อนตัดสินใจ" },
  { icon: Ruler, title: "ดีไซน์สวย", text: "มีแบบให้เลือกหลายสไตล์ ตอบโจทย์ทั้งบ้านพักและธุรกิจ" },
  { icon: SlidersHorizontal, title: "ปรับแต่งได้", text: "เลือกวัสดุและออปชันให้เหมาะกับการใช้งานจริง" },
  { icon: LifeBuoy, title: "บริการครบวงจร", text: "ให้คำปรึกษา ผลิต ขนส่ง ติดตั้ง และบริการหลังการขาย" },
];

export function WhyUs() {
  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why us"
          title="ทำไมต้องเลือกบ้านน็อคดาวน์ของเรา"
          description="เราออกแบบกระบวนการทั้งหมดให้ลูกค้าเห็นภาพชัดเจนตั้งแต่วันแรกจนวันส่งมอบ"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title} className="card-surface p-6">
              <w.icon className="h-6 w-6 text-secondary" />
              <h3 className="mt-4 text-lg font-semibold">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const USAGES = [
  { title: "บ้านสวน", text: "บ้านหลังเล็กในพื้นที่สีเขียว", img: "/images/model-b.jpg" },
  { title: "บ้านพัก", text: "บ้านพักอาศัยพร้อมเข้าอยู่", img: "/images/model-a.jpg" },
  { title: "รีสอร์ท", text: "ขยายห้องพักได้ทีละหลัง", img: "/images/project-2.jpg" },
  { title: "Pool Villa", text: "ดีไซน์พรีเมียมพร้อมระเบียงกว้าง", img: "/images/model-c.jpg" },
  { title: "โฮมสเตย์", text: "ต้นทุนคุ้มค่า คืนทุนไว", img: "/images/project-1.jpg" },
  { title: "ร้านกาแฟ", text: "อาคารกระจกเปิดโล่ง", img: "/images/project-3.jpg" },
  { title: "สำนักงาน", text: "ออฟฟิศหน้าไซต์งานพร้อมใช้", img: "/images/model-d.jpg" },
  { title: "ห้องพัก", text: "ห้องพักพนักงานหลายยูนิต", img: "/images/project-4.jpg" },
];

export function UsageCards() {
  return (
    <section className="section-y bg-card">
      <div className="container-x">
        <SectionHeading
          eyebrow="Use cases"
          title="บ้านน็อคดาวน์ เหมาะกับอะไรบ้าง?"
          description="ตั้งแต่บ้านหลังเล็กในสวน ไปจนถึงโครงการรีสอร์ทหลายหลัง"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USAGES.map((u) => (
            <article key={u.title} className="zoom-media card-surface overflow-hidden">
              <img
                src={u.img}
                alt={`บ้านน็อคดาวน์สำหรับ${u.title}`}
                loading="lazy"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{u.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{u.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { no: "01", title: "เลือกแบบบ้าน", text: "เลือกจากแคตตาล็อกหรือส่งแบบที่คุณมี" },
  { no: "02", title: "ปรึกษาและประเมินราคา", text: "ทีมงานสรุปออปชันและราคาประมาณการ" },
  { no: "03", title: "สำรวจพื้นที่", text: "ตรวจสอบทางเข้าออก ฐานราก และระบบไฟ-ประปา" },
  { no: "04", title: "ผลิตบ้าน", text: "ผลิตในโรงงานพร้อมตรวจคุณภาพทุกขั้นตอน" },
  { no: "05", title: "ขนส่งและติดตั้ง", text: "ขนส่งถึงหน้างานและติดตั้งจนพร้อมใช้งาน" },
];

export function ProcessTimeline() {
  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHeading eyebrow="Process" title="ขั้นตอนการสั่งซื้อ" description="5 ขั้นตอน เข้าใจง่ายภายในไม่กี่วินาที" />
        <ol className="mt-10 grid gap-5 md:grid-cols-5">
          {STEPS.map((s) => (
            <li key={s.no} className="card-surface p-5">
              <span className="text-2xl font-semibold text-secondary">{s.no}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PortfolioGallery({ limit }: { limit?: number }) {
  const { data: projects = [] } = useQuery(projectsQuery);
  const [filter, setFilter] = useState("ทั้งหมด");
  const [active, setActive] = useState<(typeof projects)[number] | null>(null);

  const categories = ["ทั้งหมด", ...Array.from(new Set(projects.map((p) => p.category)))];
  let list = filter === "ทั้งหมด" ? projects : projects.filter((p) => p.category === filter);
  if (limit) list = list.slice(0, limit);

  return (
    <section className="section-y bg-card">
      <div className="container-x">
        <SectionHeading eyebrow="Portfolio" title="ผลงานบ้านน็อคดาวน์ของเรา" />
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                filter === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className="zoom-media card-surface overflow-hidden text-left"
            >
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={`ผลงานบ้านน็อคดาวน์ ${p.title} จังหวัด${p.province ?? ""}`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : null}
              <div className="p-4">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {p.province} · {p.model_name} · {p.size_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{active?.title}</DialogTitle>
          <DialogDescription>
            {active?.province} · รุ่น {active?.model_name} · {active?.size_text} · ติดตั้ง{" "}
            {active?.install_time}
          </DialogDescription>
          {active?.image_url ? (
            <img
              src={active.image_url}
              alt={active.title}
              className="w-full rounded-xl object-cover"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function ReviewsSection() {
  const { data: reviews = [] } = useQuery(reviewsQuery);
  return (
    <section className="section-y">
      <div className="container-x">
        <SectionHeading eyebrow="Reviews" title="เสียงจากลูกค้าของเรา" />
        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
          {reviews.map((r) => (
            <figure key={r.id} className="card-surface w-[85%] shrink-0 snap-start p-6 sm:w-[380px]">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-muted font-semibold">
                  {r.customer_name.slice(3, 4) || "ล"}
                </span>
                <div>
                  <figcaption className="font-medium">{r.customer_name}</figcaption>
                  <p className="text-xs text-muted-foreground">
                    {r.province} · {r.model_name}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5 text-secondary">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-sm text-muted-foreground">{r.content}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const { data: faqs = [] } = useQuery(faqsQuery);
  return (
    <section className="section-y bg-card">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading eyebrow="FAQ" title="คำถามที่พบบ่อย" description="รวมคำถามที่ลูกค้าถามเราบ่อยที่สุดก่อนตัดสินใจ" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f) => (
            <AccordionItem key={f.id} value={f.id}>
              <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function ContactCTA() {
  const { data: s = {} } = useQuery(settingsQuery);
  const { openQuote } = useQuote();
  const lineUrl = s["line_id"]
    ? `https://line.me/R/ti/p/${encodeURIComponent(s["line_id"])}`
    : "https://line.me";

  return (
    <section className="section-y">
      <div className="container-x">
        <div className="rounded-3xl bg-primary px-6 py-14 text-primary-foreground md:px-14">
          <h2 className="max-w-2xl text-3xl font-semibold md:text-4xl">
            กำลังมองหาบ้านน็อคดาวน์อยู่ใช่ไหม?
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            ส่งแบบบ้านหรือขนาดพื้นที่ของคุณมาให้เรา ทีมงานช่วยประเมินเบื้องต้นให้ได้
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="secondary" size="lg" asChild>
              <a href={`tel:${s["phone"] ?? ""}`}>
                <Phone className="mr-2 h-4 w-4" /> โทรหาเรา
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <a href={lineUrl} target="_blank" rel="noreferrer noopener">
                <MessageCircle className="mr-2 h-4 w-4" /> LINE
              </a>
            </Button>
            <Button size="lg" variant="secondary" onClick={() => openQuote()}>
              ขอใบเสนอราคา
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => openQuote()}
            >
              ส่งแบบบ้านให้ทีมงาน
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StatsBand() {
  const { data: s = {} } = useQuery(settingsQuery);
  const stats = [
    { value: Number(s["stat_delivered"] ?? 0), suffix: "+", label: "หลังที่ส่งมอบแล้ว" },
    { value: Number(s["stat_years"] ?? 0), suffix: " ปี", label: "ประสบการณ์ผลิตบ้าน" },
    { value: Number(s["stat_provinces"] ?? 0), suffix: "", label: "จังหวัดที่ให้บริการ" },
    { value: Number(s["stat_models"] ?? 0), suffix: "", label: "แบบบ้านให้เลือก" },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((st) => (
        <div key={st.label} className="card-surface p-6">
          <p className="text-4xl font-semibold">
            <Counter value={st.value} />
            {st.suffix}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{st.label}</p>
        </div>
      ))}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / 900);
        setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{display.toLocaleString("th-TH")}</span>;
}

export function ModelsCtaLink() {
  return (
    <Button asChild variant="outline" size="lg">
      <Link to="/models">ดูแบบบ้านทั้งหมด</Link>
    </Button>
  );
}
