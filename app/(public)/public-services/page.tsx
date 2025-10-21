// app/(public)/public-services/page.tsx
import ServiceCatalog from "@/components/E-Service/ServiceCatalog";
import type { E_Service } from "@/types/publicTypes";

async function fetchEServices(): Promise<E_Service[]> {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseURL}/api/eservice`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as E_Service[];
    // ให้แน่ใจว่าเป็น primitive string
    return data.map((x) => ({
      id: String(x.id),
      title: String(x.title),
      image: x.image ? String(x.image) : "",
      linkURL: String(x.linkURL),
      createdAt: x.createdAt ? String(x.createdAt) : "",
      updatedAt: x.updatedAt ? String(x.updatedAt) : "",
    }));
  } catch {
    return [];
  }
}

export default async function PublicServicesPage() {
  const items = await fetchEServices();

  return (
    <ServiceCatalog
      items={items}
      headingTitle="e-Service ทั้งหมด"
      headingDescription="รวมบริการออนไลน์ของสำนักสาธารณสุขและสิ่งแวดล้อม ใช้งานได้ตลอด 24 ชั่วโมง"
      label="บริการออนไลน์"
      subtitle="คลิกเพื่อเข้าใช้บริการ"
      pageSize={9}         // ปรับได้: จำนวนการ์ดต่อการกดแสดงเพิ่ม
    />
  );
}
