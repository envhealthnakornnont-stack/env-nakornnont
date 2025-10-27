export const isExternal = (href: string) =>
  /^(https?:)?\/\//.test(href);

export const isHashLink = (href: string) =>
  href.startsWith("#");

/** สร้าง aria-label ให้ชัด: ใส่บริบท “เปิดหน้าต่างใหม่” หรือ “ไปยังส่วน…” โดยอัตโนมัติ */
export function a11yLabel(label: string, href: string, custom?: string, newTab?: boolean) {
  if (custom) return custom;

  if (isHashLink(href)) {
    // e.g. #calendar → "ไปยังส่วน ปฏิทินกิจกรรม"
    return `ไปยังส่วน ${label}`;
  }
  if (newTab || isExternal(href)) {
    // e.g. ลิงก์ออกนอก เปิดแท็บใหม่
    return `${label} (เปิดหน้าต่างใหม่)`;
  }
  return label;
}
