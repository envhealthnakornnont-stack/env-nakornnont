import type { Metadata } from "next";
import TermsSection from "@/components/Policy/Terms/TermsSection";

export const metadata: Metadata = {
  title: "เงื่อนไขการใช้งาน",
  description: "ข้อกำหนดการใช้งานเว็บไซต์และ e-Service ของสำนักสาธารณสุขและสิ่งแวดล้อม",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <TermsSection />
  );
}
