import type { Metadata } from "next";
import PrivacySection from "@/components/Policy/Privacy/PrivacySection";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description:
    "คำอธิบายการเก็บ ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้บริการสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <PrivacySection />
  );
}
