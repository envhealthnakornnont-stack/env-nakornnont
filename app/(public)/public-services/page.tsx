// app/(public)/public-services/page.tsx
import ServiceCatalog from "@/components/E-Service/ServiceCatalog";
import { EServiceItem } from "@/components/E-Service/types";

async function fetchEServices(): Promise<EServiceItem[]> {
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseURL}/api/eservice`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as EServiceItem[];
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
  const service = await fetchEServices();

  return (
    <ServiceCatalog
      items={service}
      headingTitle="e-Service ทั้งหมด"
      headingDescription="รวมบริการออนไลน์ของสำนักสาธารณสุขและสิ่งแวดล้อม ใช้งานได้ตลอด 24 ชั่วโมง"
      pageSize={9}
    />
  );
}
