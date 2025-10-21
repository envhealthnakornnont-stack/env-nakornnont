"use client";

import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MoveUp } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SocialMediaLinks from "./SocialMediaLinks";

/* ---------- Section data (reuse ได้ทั้ง Grid และ Accordion) ---------- */

function QuickLinksList() {
  return (
    <ul className="space-y-2 text-sm">
      <li><Link className="hover:text-foreground transition-colors" href="/public-services">บริการออนไลน์ (e-Service)</Link></li>
      <li><Link className="hover:text-foreground transition-colors" href="/news/news-updates">ข่าวประชาสัมพันธ์</Link></li>
      <li><Link className="hover:text-foreground transition-colors" href="/news/activities">กิจกรรมของสำนัก</Link></li>
      <li><Link className="hover:text-foreground transition-colors" href="/contact">ติดต่อเรา</Link></li>
    </ul>
  );
}

function PoliciesList() {
  return (
    <ul className="space-y-2 text-sm">
      <li><Link className="hover:text-foreground transition-colors" href="/policies/privacy">นโยบายความเป็นส่วนตัว</Link></li>
      <li><Link className="hover:text-foreground transition-colors" href="/policies/terms">เงื่อนไขการใช้งาน</Link></li>
      <li><Link className="hover:text-foreground transition-colors" href="/accessibility">การเข้าถึง (Accessibility)</Link></li>
      <li><Link className="hover:text-foreground transition-colors" href="/sitemap">แผนผังเว็บไซต์</Link></li>
    </ul>
  );
}

function ContactList() {
  return (
    <ul className="text-sm space-y-2 break-words hyphens-auto">
      <li>ที่อยู่: 1,3 ซอยรัตนาธิเบศร์ 6 ต.บางกระสอ อ.เมืองนนทบุรี จ.นนทบุรี 11000</li>
      <li>โทรกลาง: 0-2589-0500</li>
      <li>อีเมล: <strong>Env.health.nakornnont@gmail.com</strong></li>
      <li className="pt-1 flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline"><Link href="/contact">ติดต่อเรา</Link></Button>
        <Button asChild size="sm" variant="ghost">
          <Link href="https://maps.app.goo.gl/DXWMLEhD8q6ap3hZ7" target="_blank">ดูแผนที่</Link>
        </Button>
      </li>
    </ul>
  );
}

/* ------------------------------- Footer ------------------------------- */

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20 text-muted-foreground">
      {/* UPPER */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Mobile/Tablet: Accordion */}
        <div className="md:hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="quicklinks">
              <AccordionTrigger className="text-left text-foreground font-medium">ลิงก์ด่วน</AccordionTrigger>
              <AccordionContent className="pt-2"><QuickLinksList /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="policies">
              <AccordionTrigger className="text-left text-foreground font-medium">นโยบาย & มาตรฐาน</AccordionTrigger>
              <AccordionContent className="pt-2"><PoliciesList /></AccordionContent>
            </AccordionItem>
            <AccordionItem value="contact">
              <AccordionTrigger className="text-left text-foreground font-medium">ติดต่อราชการ</AccordionTrigger>
              <AccordionContent className="pt-2"><ContactList /></AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Desktop: 3 คอลัมน์ */}
        <div className="hidden md:grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <section className="min-w-0">
            <p className="text-foreground font-medium mb-3">ลิงก์ด่วน</p>
            <QuickLinksList />
          </section>

          <section className="min-w-0">
            <p className="text-foreground font-medium mb-3">นโยบาย & มาตรฐาน</p>
            <PoliciesList />
          </section>

          <section className="min-w-0">
            <p className="text-foreground font-medium mb-3">ติดต่อราชการ</p>
            <ContactList />
          </section>
        </div>
      </div>

      <Separator />

      {/* LOWER: Brand/Mission + Social + Actions (แก้ล้นจอ) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

    {/* Brand / Mission — row 1 on mobile */}
    <div className="flex items-center gap-3 min-w-0 mx-auto sm:mx-0">
      <Image
        src="/mobile/mobile-logo.png"
        alt="โลโก้สำนักสาธารณสุขและสิ่งแวดล้อม"
        width={36}   // เดิม 40 → คอมแพคขึ้น
        height={36}
        className="rounded-lg ring-1 ring-border shrink-0"
        priority
      />
      <div className="leading-tight min-w-0">
        <p className="text-foreground font-semibold truncate">
          สำนักสาธารณสุขและสิ่งแวดล้อม 
        </p>
        <p className="text-xs sm:text-sm break-words hyphens-auto max-w-[32ch]">
          เทศบาลนครนนทบุรี
        </p>
        {/* วิสัยทัศน์แบบสั้น + จำกัดความกว้าง กันเบียด */}
        <p className="text-[11px] sm:text-xs break-words hyphens-auto max-w-[38ch]">
          นครนนท์เมืองน่าอยู่ คุณภาพชีวิตดี บริการเป็นเลิศ บริหารจัดการดี
        </p>
      </div>
    </div>

    {/* Social + domain + Back-to-top — row 2 on mobile */}
    <div className="flex items-center gap-2 flex-wrap">
      {/* ทำให้ไอคอนกระชับบนมือถือ */}
      <div className="scale-90 md:scale-100">
        <SocialMediaLinks />
      </div>

      {/* โดเมน: แสดงตั้งแต่ md ขึ้นไป เพื่อลดการล้นบนมือถือ */}
      <span className="hidden md:inline text-xs" aria-hidden>•</span>
      <Link
        href="https://behn.go.th"
        className="hidden md:inline text-xs hover:text-foreground"
      >
        behn.go.th
      </Link>

      {/* ปุ่มเลื่อนขึ้นบน: ใช้ size icon ให้เล็กลง และวางท้ายแถว */}
      <Button
        size="icon"
        variant="outline"
        className="h-8 w-8 ml-auto md:ml-0"
        aria-label="กลับขึ้นด้านบน"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <MoveUp className="h-4 w-4" />
      </Button>
    </div>
  </div>

  {/* Copyright */}
  <div className="mt-3 text-xs text-center">
    © {new Date().getFullYear()} สำนักสาธารณสุขและสิ่งแวดล้อม – เทศบาลนครนนทบุรี. สงวนลิขสิทธิ์.
  </div>
</div>
    </footer>
  );
}
