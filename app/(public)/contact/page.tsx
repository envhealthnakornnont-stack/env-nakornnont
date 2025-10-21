import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage, } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";

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

const ADDRESS =
  "1,3 ซอยรัตนาธิเบศร์ 6 ตำบลบางกระสอ อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000";
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/DXWMLEhD8q6ap3hZ7";
const PHONES = [
  { label: "โทรกลาง", value: "0-2589-0500" },
  { label: "ฝ่ายวิชาการและการประเมินผล", value: "0-2589-0500 ต่อ 1218" },
  { label: "ฝ่ายส่งเสริมสาธารณสุข", value: "0-2589-0500 ต่อ 1214" },
  { label: "ฝ่ายจัดการมูลฝอยและสิ่งปฏิกูล", value: "0-2589-0500 ต่อ 1202" },
  { label: "ฝ่ายควบคุมและจัดการคุณภาพสิ่งแวดล้อม", value: "0-2589-0500 ต่อ 1207" },
];
const EMAIL = "Env.health.nakornnont@gmail.com";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4 text-sm text-muted-foreground">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/" className="hover:text-foreground">หน้าหลัก</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>ติดต่อเรา</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">ติดต่อเรา</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        ช่องทางติดต่อสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี และแบบฟอร์มอีเมลสำหรับส่งข้อความถึงเรา
      </p>
      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2">
        {/* ฟอร์ม (Client Component) */}
        <Card className="order-2 md:order-1">
          <CardHeader><CardTitle>ส่งข้อความผ่านอีเมล</CardTitle></CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        {/* ข้อมูลติดต่อ + แผนที่ใน Dialog */}
        <div className="order-1 md:order-2 space-y-4">
          <Card>
            <CardHeader><CardTitle>ข้อมูลติดต่อ</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Image src="/mobile/mobile-logo.png" alt="โลโก้สำนัก" width={40} height={40} className="rounded-md ring-1 ring-border" />
                <div className="min-w-0">
                  <p className="font-medium text-foreground">สำนักสาธารณสุขและสิ่งแวดล้อม</p>
                  <p className="text-muted-foreground">{ADDRESS}</p>
                </div>
              </div>

              <ul className="space-y-1">
                {PHONES.map((p) => (
                  <li key={p.label} className="flex flex-col lg:flex-row lg:gap-2">
                    <span className="shrink-0 text-muted-foreground">{p.label}:</span>
                    <span className="font-medium">{p.value}</span>
                  </li>
                ))}
                <li className="flex gap-2">
                  <span className="shrink-0 text-muted-foreground">อีเมล:</span>
                  <span className="font-medium break-words">{EMAIL}</span>
                </li>
              </ul>

              <div className="flex gap-2 pt-1">
                <Button asChild variant="outline"><Link href={`mailto:${EMAIL}`}>ส่งอีเมล</Link></Button>

                <Dialog>
                  <DialogTrigger asChild><Button variant="ghost">ดูแผนที่</Button></DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>แผนที่สำนักสาธารณสุขและสิ่งแวดล้อม</DialogTitle>
                      <DialogDescription>ตำแหน่ง: {ADDRESS}</DialogDescription>
                    </DialogHeader>
                    <div className="h-[60vh] w-full overflow-hidden rounded-md ring-1 ring-border">
                      <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7747.243867631507!2d100.513576!3d13.861718000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x57078dcef1af9d03!2z4Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZ4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LiZ4LiZ4LiX4Lia4Li44Lij4Li1!5e0!3m2!1sth!2sth!4v1657758534123!5m2!1sth!2sth"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <div className="pt-3">
                      <Button asChild>
                        <Link href={GOOGLE_MAPS_URL} target="_blank" className="inline-flex items-center gap-2">
                          เปิดใน Google Maps <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>ศูนย์บริการและพัฒนาคุณภาพสิ่งแวดล้อม</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Image src="/mobile/mobile-logo.png" alt="โลโก้สำนัก" width={40} height={40} className="rounded-md ring-1 ring-border" />
                <div className="min-w-0">
                  <p className="text-muted-foreground">ซอยติวานนท์ 24แยก13 ตำบลบางกระสอ อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button asChild variant="outline"><Link href={`mailto:${EMAIL}`}>ส่งอีเมล</Link></Button>
                <Dialog>
                  <DialogTrigger asChild><Button variant="ghost">ดูแผนที่</Button></DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>แผนที่ศูนย์บริการและพัฒนาคุณภาพสิ่งแวดล้อม (โรงปุ๋ยชีวภาพ)</DialogTitle>
                      <DialogDescription>ตำแหน่ง: ซอยติวานนท์ 24แยก13 ตำบลบางกระสอ อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000</DialogDescription>
                    </DialogHeader>
                    <div className="h-[60vh] w-full overflow-hidden rounded-md ring-1 ring-border">
                      <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1936.764753669215!2d100.52820300000002!3d13.867257!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b55e9e1df2b%3A0xa30971d69b2632ac!2z4Lio4Li54LiZ4Lii4LmM4Lia4Lij4Li04LiB4Liy4Lij4LmB4Lil4Liw4Lie4Lix4LiS4LiZ4Liy4LiE4Li44LiT4Lig4Liy4Lie4Liq4Li04LmI4LiH4LmB4Lin4LiU4Lil4LmJ4Lit4LihIOC5gOC4l-C4qOC4muC4suC4peC4meC4hOC4o-C4meC4meC4l-C4muC4uOC4o-C4tSAo4LmC4Lij4LiH4Lib4Li44LmL4Lii4LiK4Li14Lin4Lig4Liy4LieKQ!5e0!3m2!1sth!2sth!4v1760385826075!5m2!1sth!2sth"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <div className="pt-3">
                      <Button asChild>
                        <Link href="https://maps.app.goo.gl/t9peNe7VTxq3o18d8" target="_blank" className="inline-flex items-center gap-2">
                          เปิดใน Google Maps <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>คลินิกสัตว์แพทย์เทศบาลนครนนทบุรี</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Image src="/mobile/mobile-logo.png" alt="โลโก้สำนัก" width={40} height={40} className="rounded-md ring-1 ring-border" />
                <div className="min-w-0">
                  <p className="text-muted-foreground">ประชานิเวศน์ 3 ซอย 14 ท่าทราย อำเภอเมืองนนทบุรี นนทบุรี 11000</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button asChild variant="outline"><Link href={`mailto:${EMAIL}`}>ส่งอีเมล</Link></Button>
                <Dialog>
                  <DialogTrigger asChild><Button variant="ghost">ดูแผนที่</Button></DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>แผนที่คลินิกสัตว์แพทย์เทศบาลนครนนทบุรี</DialogTitle>
                      <DialogDescription>ตำแหน่ง: ประชานิเวศน์ 3 ซอย 14 ท่าทราย อำเภอเมืองนนทบุรี นนทบุรี 11000</DialogDescription>
                    </DialogHeader>
                    <div className="h-[60vh] w-full overflow-hidden rounded-md ring-1 ring-border">
                      <iframe
                        title="Google Map"
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d484.18345169979904!2d100.532262!3d13.870965!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d157c85c4cd%3A0xd451fa24994edfd2!2z4LiE4Lil4Li04LiZ4Li04LiB4Liq4Lix4LiV4Lin4LmB4Lie4LiX4Lii4LmM4LmA4LiX4Lio4Lia4Liy4Lil4LiZ4LiE4Lij4LiZ4LiZ4LiX4Lia4Li44Lij4Li1!5e0!3m2!1sth!2sth!4v1760385662674!5m2!1sth!2sth"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <div className="pt-3">
                      <Button asChild>
                        <Link href="https://maps.app.goo.gl/KXdzqzsU2QqEE5tB7" target="_blank" className="inline-flex items-center gap-2">
                          เปิดใน Google Maps <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

// export const metadata = {
//   title: "ติดต่อเรา | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
//   description:
//   "ติดต่อสอบถามข้อมูล บริการแจ้งปัญหา หรือเสนอข้อคิดเห็นมายังสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี ได้ที่นี่",
//   keywords: [
//     "ติดต่อเทศบาล",
//     "ติดต่อเรา",
//     "สำนักสาธารณสุข",
//     "สิ่งแวดล้อม",
//     "เทศบาลนครนนทบุรี",
//     "แจ้งปัญหา",
//     "สอบถามข้อมูล",
//     "ช่องทางติดต่อ",
//     "ข้อมูลการติดต่อ",
//   ],
//   alternates: {
//     canonical: "/contact",
//   },
//   openGraph: {
//     title: "ติดต่อเรา | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
//     description:
//       "รวมข้อมูลช่องทางการติดต่อหน่วยงานสาธารณสุขและสิ่งแวดล้อม พร้อมแผนที่และแบบฟอร์มออนไลน์",
//     url: `/contact`,
//     siteName: "เทศบาลนครนนทบุรี",
//     images: ["/logo-nonthaburi.jpg"],
//     locale: "th_TH",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "ติดต่อเรา | สำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
//     description:
//     "สอบถามข้อมูล แจ้งปัญหา หรือติดต่อราชการกับสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี",
//     images: ["/logo-nonthaburi.jpg"],
//   },
// };