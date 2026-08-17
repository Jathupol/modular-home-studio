import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuote } from "./QuoteProvider";

const NAV = [
  { to: "/", label: "หน้าแรก" },
  { to: "/models", label: "แบบบ้าน" },
  { to: "/portfolio", label: "ผลงาน" },
  { to: "/features", label: "จุดเด่น" },
  { to: "/process", label: "ขั้นตอนการสั่งซื้อ" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "ติดต่อเรา" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { openQuote } = useQuote();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            KD
          </span>
          <span className="text-base font-semibold tracking-tight">
            คาซ่า น็อคดาวน์
            <span className="block text-[11px] font-normal tracking-widest text-muted-foreground">
              PREFAB HOUSE STUDIO
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="text-sm transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button className="hidden sm:inline-flex" onClick={() => openQuote()}>
            ขอใบเสนอราคา
          </Button>
          <button
            aria-label="เมนู"
            className="rounded-md p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-card lg:hidden">
          <nav className="container-x flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-foreground/90"
              >
                {item.label}
              </Link>
            ))}
            <Button
              className="my-3"
              onClick={() => {
                setOpen(false);
                openQuote();
              }}
            >
              ขอใบเสนอราคา
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
