type LinkItem = { label: string; href: string };
type DownloadItem = { name: string; href: string; size?: string; updatedAt?: string };
type Contact = { name: string; role?: string; phone?: string; email?: string };

export type DeptKey =
    | "generalAffairs"
    | "publicHealthPromotion"
    | "environmentalHealthServices"
    | "environmentalHealthPromotion";

export type DepartmentConfig = {
    key: DeptKey;
    slug: string;
    title: string;        // ชื่อหน้า
    subtitle?: string;    // คำอธิบายสั้น
    hero: {
        image?: string;     // /images/dep-*.jpg (ถ้าไม่มีจะใช้พื้นหลัง gradient)
        badge?: string;     // ป้าย เช่น “หน่วยงานภายใน”
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
        openGraphImage?: string;
    };
    kpis?: { label: string; value: string }[];   // ตัวเลขสรุปไว ๆ
    missions: string[];                          // ภารกิจ/หน้าที่
    services: { title: string; desc?: string; link?: string }[]; // บริการ/งานเด่น
    highlights?: LinkItem[];                     // ข่าว/กิจกรรมเด่น
    downloads?: DownloadItem[];                  // แบบฟอร์ม/ระเบียบ/คู่มือ
    faqs?: { q: string; a: string }[];
    contacts?: Contact[];
};

export type DepartmentViewProps = {
    dept: DeptKey;
    data: DepartmentConfig; // departments[dept]
};
