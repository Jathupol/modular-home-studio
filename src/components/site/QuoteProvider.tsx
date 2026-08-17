import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { QuoteDialog } from "./QuoteDialog";
import type { HouseModel } from "@/lib/site-data";

type OpenArgs = { model?: HouseModel | null; options?: string[]; estimated?: number | null };

const QuoteContext = createContext<{ openQuote: (args?: OpenArgs) => void }>({
  openQuote: () => {},
});

export const useQuote = () => useContext(QuoteContext);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [args, setArgs] = useState<OpenArgs>({});

  const openQuote = useCallback((next: OpenArgs = {}) => {
    setArgs(next);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteDialog
        open={open}
        onOpenChange={setOpen}
        model={args.model ?? null}
        presetOptions={args.options ?? []}
        estimated={args.estimated ?? null}
      />
    </QuoteContext.Provider>
  );
}
