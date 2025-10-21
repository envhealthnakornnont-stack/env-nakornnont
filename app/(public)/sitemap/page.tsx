import type { Metadata } from "next";
import PolicyLayout from "@/components/policy/policy-layout";
import Link from "next/link";

export const metadata: Metadata = {
  title: "แผนผังเว็บไซต์",
  description: "รวมลิงก์สำคัญของเว็บไซต์สำนักสาธารณสุขและสิ่งแวดล้อม",
  robots: { index: true, follow: true },
};

export default function HtmlSitemapPage() {
  return (
    <PolicyLayout title="แผนผังเว็บไซต์" updatedAt="2025-10-14">
      <h2>ส่วนประชาชน</h2>
      <ul>
        <li><Link href="/">หน้าหลัก</Link></li>
        <li><Link href="/public-services">บริการออนไลน์ (e-Service)</Link></li>
        <li><Link href="/about/personnel/management">คณะผู้บริหาร</Link></li>
        <li><Link href="/about/structure">โครงสร้างองค์กร</Link></li>
        <li><Link href="/about/roles">อำนาจหน้าที่</Link></li>
        <li><Link href="/departments/general-affairs">ฝ่ายบริหารงานทั่วไป</Link></li>
        <li><Link href="/departments/public-health-promotion">ส่วนส่งเสริมสาธารณสุข</Link></li>
        <li><Link href="/departments/environmental-health-services">ส่วนบริการอนามัยสิ่งแวดล้อม</Link></li>
        <li><Link href="/departments/environmental-health-promotion">ส่วนส่งเสริมอนามัยสิ่งแวดล้อม</Link></li>
        <li><Link href="/news/news-updates">ข่าวประชาสัมพันธ์</Link></li>
        <li><Link href="/news/activities">กิจกรรมของสำนัก</Link></li>
        <li><Link href="/contact">ติดต่อเรา</Link></li>
      </ul>

      <h2>นโยบายและข้อมูลอ้างอิง</h2>
      <ul>
        <li><Link href="/policies/privacy">นโยบายความเป็นส่วนตัว</Link></li>
        <li><Link href="/policies/terms">เงื่อนไขการใช้งาน</Link></li>
        <li><Link href="/accessibility">การเข้าถึง (Accessibility)</Link></li>
      </ul>
    </PolicyLayout>
  );
}
