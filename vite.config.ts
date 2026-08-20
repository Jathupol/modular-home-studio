// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// เมื่อ build บน Vercel (ตัวแปร VERCEL ถูกตั้งอัตโนมัติ) ให้ใช้ nitro preset "vercel"
// ผลลัพธ์จะออกที่ .vercel/output ซึ่ง Vercel นำไป deploy ได้ทันที
const isVercel = !!process.env["VERCEL"];

export default defineConfig({
  ...(isVercel ? { nitro: { preset: "vercel" } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
