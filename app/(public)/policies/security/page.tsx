import type { Metadata } from "next";
import SecuritySection from "@/components/Policy/Security/SecuritySection";

export const metadata: Metadata = {
    title: "นโยบายความปลอดภัยและการคุ้มครองข้อมูล",
    description:
        "แนวนโยบายและมาตรการรักษาความมั่นคงปลอดภัยของข้อมูล สำหรับระบบสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
    alternates: { canonical: "/policies/security" },
    robots: { index: true, follow: true },
};

export default function SecurityPage() {
    return (
        <SecuritySection />
    );
}