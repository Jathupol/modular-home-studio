import { supabase } from "@/integrations/supabase/client";

export type HouseModel = {
  id: string;
  slug: string;
  code: string;
  name: string;
  tagline: string | null;
  description: string | null;
  width_m: number;
  length_m: number;
  area_sqm: number;
  bedrooms: number;
  bathrooms: number;
  base_price: number;
  materials: string | null;
  production_days: number;
  install_days: number;
  cover_image: string | null;
  usages: string[];
  is_published: boolean;
  sort_order: number;
};

export type HouseOption = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

export type ModelImage = {
  id: string;
  model_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export type Project = {
  id: string;
  title: string;
  province: string | null;
  model_name: string | null;
  size_text: string | null;
  install_time: string | null;
  category: string;
  image_url: string | null;
  sort_order: number;
};

export type Review = {
  id: string;
  customer_name: string;
  province: string | null;
  model_name: string | null;
  rating: number;
  content: string;
  sort_order: number;
};

export type Faq = { id: string; question: string; answer: string; sort_order: number };

export type Lead = {
  id: string;
  full_name: string;
  phone: string;
  line_id: string | null;
  email: string | null;
  province: string | null;
  model_name: string | null;
  quantity: number;
  selected_options: string[];
  budget: string | null;
  install_date: string | null;
  message: string | null;
  attachments: string[];
  estimated_price: number | null;
  status: string;
  created_at: string;
};

export const LEAD_STATUSES = [
  "รอติดต่อ",
  "กำลังเสนอราคา",
  "รอยืนยัน",
  "ยืนยันแล้ว",
  "ผลิต",
  "ติดตั้งแล้ว",
  "ยกเลิก",
] as const;

export const USAGE_TAGS = [
  "บ้านสวน",
  "บ้านพัก",
  "รีสอร์ท",
  "Pool Villa",
  "โฮมสเตย์",
  "ร้านกาแฟ",
  "สำนักงาน",
  "ห้องพัก",
  "ร้านค้า",
];

export const thb = (value: number) =>
  new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 }).format(Math.round(value));

export const modelsQuery = {
  queryKey: ["house_models"],
  queryFn: async (): Promise<HouseModel[]> => {
    const { data, error } = await supabase
      .from("house_models")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as HouseModel[];
  },
};

export const optionsQuery = {
  queryKey: ["house_options"],
  queryFn: async (): Promise<HouseOption[]> => {
    const { data, error } = await supabase
      .from("house_options")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as HouseOption[];
  },
};

export const projectsQuery = {
  queryKey: ["projects"],
  queryFn: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Project[];
  },
};

export const reviewsQuery = {
  queryKey: ["reviews"],
  queryFn: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Review[];
  },
};

export const faqsQuery = {
  queryKey: ["faqs"],
  queryFn: async (): Promise<Faq[]> => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Faq[];
  },
};

export const settingsQuery = {
  queryKey: ["site_settings"],
  queryFn: async (): Promise<Record<string, string>> => {
    const { data, error } = await supabase.from("site_settings").select("key,value");
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
  },
};

export const modelImagesQuery = (modelId: string) => ({
  queryKey: ["model_images", modelId],
  queryFn: async (): Promise<ModelImage[]> => {
    const { data, error } = await supabase
      .from("model_images")
      .select("*")
      .eq("model_id", modelId)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ModelImage[];
  },
});

export function estimatePrice(input: {
  basePrice: number;
  optionsTotal: number;
  quantity: number;
  installFee: number;
  transportRatePerKm: number;
  distanceKm: number;
}) {
  const houses = input.basePrice * input.quantity;
  const options = input.optionsTotal * input.quantity;
  const transport = input.transportRatePerKm * input.distanceKm * input.quantity;
  const install = input.installFee * input.quantity;
  return { houses, options, transport, install, total: houses + options + transport + install };
}
