import type { Metadata } from "next";
import SitemapSection from "@/components/Policy/Sitemap/SitemapSection";

export const metadata: Metadata = {
  title: "แผนผังเว็บไซต์",
  description: "รวมลิงก์สำคัญของเว็บไซต์สำนักสาธารณสุขและสิ่งแวดล้อม",
  robots: { index: true, follow: true },
};

export default function HtmlSitemapPage() {
  return (
    <SitemapSection/>
  );
}
