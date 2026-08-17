import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "เข้าสู่ระบบผู้ดูแล | คาซ่า น็อคดาวน์" },
      { name: "description", content: "เข้าสู่ระบบสำหรับทีมงานเพื่อจัดการแบบบ้าน คำขอใบเสนอราคา และเนื้อหาเว็บไซต์" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "เข้าสู่ระบบผู้ดูแล | คาซ่า น็อคดาวน์" },
      { property: "og:description", content: "สำหรับทีมงานผู้ดูแลระบบเท่านั้น" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setLoading(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <section className="section-y">
      <div className="container-x max-w-md">
        <div className="card-surface p-8">
          <h1 className="text-2xl font-semibold">
            {mode === "signin" ? "เข้าสู่ระบบผู้ดูแล" : "สมัครบัญชีผู้ดูแล"}
          </h1>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {mode === "signin" ? "เข้าสู่ระบบ" : "สมัครบัญชี"}
            </Button>
          </form>
          <button
            className="mt-4 text-sm text-muted-foreground hover:text-secondary"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "ยังไม่มีบัญชี? สมัครที่นี่" : "มีบัญชีแล้ว? เข้าสู่ระบบ"}
          </button>
        </div>
      </div>
    </section>
  );
}
