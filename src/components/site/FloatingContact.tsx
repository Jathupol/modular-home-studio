import { useQuery } from "@tanstack/react-query";
import { ClipboardList, MessageCircle, Phone } from "lucide-react";
import { settingsQuery } from "@/lib/site-data";
import { useQuote } from "./QuoteProvider";

export function FloatingContact() {
  const { data: s = {} } = useQuery(settingsQuery);
  const { openQuote } = useQuote();
  const lineUrl = s['line_id']
    ? `https://line.me/R/ti/p/${encodeURIComponent(s['line_id'])}`
    : "https://line.me";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur md:inset-x-auto md:right-6 md:bottom-6 md:w-auto md:rounded-2xl md:border md:shadow-[var(--shadow-lift)]">
      <div className="grid grid-cols-3 gap-1 p-2 md:flex md:flex-col md:gap-2 md:p-2">
        <a
          href={`tel:${s['phone'] ?? ""}`}
          className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs text-foreground hover:bg-muted md:flex-row md:gap-2 md:text-sm"
        >
          <Phone className="h-5 w-5 text-secondary" /> โทร
        </a>
        <a
          href={lineUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs text-foreground hover:bg-muted md:flex-row md:gap-2 md:text-sm"
        >
          <MessageCircle className="h-5 w-5 text-secondary" /> LINE
        </a>
        <button
          onClick={() => openQuote()}
          className="flex flex-col items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs text-primary-foreground md:flex-row md:gap-2 md:text-sm"
        >
          <ClipboardList className="h-5 w-5" /> ขอราคา
        </button>
      </div>
    </div>
  );
}
