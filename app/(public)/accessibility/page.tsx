import type { Metadata } from "next";
import AccesSection from "@/components/Policy/Accessibility/AccesSection";

export const metadata: Metadata = {
  title: "การเข้าถึง (Accessibility)",
  description: "ถ้อยแถลงด้านการเข้าถึงเว็บและแนวทางปรับปรุงเพื่อผู้ใช้ทุกกลุ่ม",
  robots: { index: true, follow: true },
};

export default function AccessibilityPage() {
  return (
    <AccesSection/>
  );
}
