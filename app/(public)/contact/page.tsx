import type { Metadata } from "next";
import ContactSection from "@/components/Contact/ContactSection";
import { CONTACT_POINTS } from "@/components/Contact/utils";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ช่องทางติดต่อสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี และแบบฟอร์มส่งข้อความออนไลน์",
  keywords: [
    "ติดต่อเทศบาล",
    "ติดต่อเรา",
    "สำนักสาธารณสุข",
    "สิ่งแวดล้อม",
    "เทศบาลนครนนทบุรี",
    "แจ้งปัญหา",
    "สอบถามข้อมูล",
    "ช่องทางติดต่อ",
    "ข้อมูลการติดต่อ",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "ติดต่อเรา",
    description:
      "ช่องทางติดต่อสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี และแบบฟอร์มส่งข้อความออนไลน์",
    url: `/contact`,
    siteName: "เทศบาลนครนนทบุรี",
    images: ["/logo-nonthaburi.jpg"],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ติดต่อเรา",
    description:
      "ช่องทางติดต่อสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี และแบบฟอร์มส่งข้อความออนไลน์",
    images: ["/logo-nonthaburi.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return <ContactSection points={CONTACT_POINTS} />;
}