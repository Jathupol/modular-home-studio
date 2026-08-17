import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { LEAD_STATUSES, modelsQuery, projectsQuery, reviewsQuery, thb } from "@/lib/site-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "แดชบอร์ดผู้ดูแลระบบ | คาซ่า น็อคดาวน์" },
      { name: "description", content: "จัดการคำขอใบเสนอราคา แบบบ้าน ผลงาน และรีวิวของเว็บไซต์" },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "แดชบอร์ดผู้ดูแลระบบ" },
      { property: "og:description", content: "สำหรับทีมงานผู้ดูแลระบบเท่านั้น" },
    ],
  }),
  component: AdminPage,
});

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  estimated_total: number | null;
  created_at: string;
};

function AdminPage() {
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setUserId(session?.user.id ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const { data: leads = [] } = useQuery({
    queryKey: ["admin-leads"],
    enabled: !!userId,
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("id,name,phone,email,message,status,estimated_total,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });
  const { data: models = [] } = useQuery(modelsQuery);
  const { data: projects = [] } = useQuery(projectsQuery);
  const { data: reviews = [] } = useQuery(reviewsQuery);

  if (userId === undefined) {
    return <div className="container-x section-y text-muted-foreground">กำลังตรวจสอบสิทธิ์…</div>;
  }

  if (!userId) {
    return (
      <div className="container-x section-y text-center">
        <p className="text-muted-foreground">กรุณาเข้าสู่ระบบเพื่อใช้งานแดชบอร์ด</p>
        <Button asChild className="mt-6">
          <Link to="/auth">ไปหน้าเข้าสู่ระบบ</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="section-y">
      <div className="container-x">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold">แดชบอร์ดผู้ดูแลระบบ</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                await claimFirstAdmin();
                qc.invalidateQueries();
              }}
            >
              รับสิทธิ์ผู้ดูแลคนแรก
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut();
              }}
            >
              ออกจากระบบ
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          <Stat label="คำขอทั้งหมด" value={leads.length} />
          <Stat label="แบบบ้าน" value={models.length} />
          <Stat label="ผลงาน" value={projects.length} />
          <Stat label="รีวิว" value={reviews.length} />
        </div>

        <div className="card-surface mt-10 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-4">ลูกค้า</th>
                <th className="p-4">ติดต่อ</th>
                <th className="p-4">ประมาณการ</th>
                <th className="p-4">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="p-4">
                    <p className="font-medium">{l.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{l.message}</p>
                  </td>
                  <td className="p-4">
                    <p>{l.phone}</p>
                    <p className="text-xs text-muted-foreground">{l.email}</p>
                  </td>
                  <td className="p-4">{l.estimated_total ? `${thb(l.estimated_total)} บ.` : "-"}</td>
                  <td className="p-4">
                    <select
                      className="h-9 rounded-md border border-input bg-card px-2"
                      value={l.status}
                      onChange={async (e) => {
                        await supabase
                          .from("leads")
                          .update({ status: e.target.value })
                          .eq("id", l.id);
                        qc.invalidateQueries({ queryKey: ["admin-leads"] });
                      }}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    ยังไม่มีคำขอใบเสนอราคา
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-surface p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
