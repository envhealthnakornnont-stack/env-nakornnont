import Link from "next/link";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "./ContactForm";          // Client
import ContactCard from "./ContactCard";          // Server
import type { ContactPoint } from "./types";

type Props = { points: ContactPoint[] };

export default function ContactSection({ points }: Props) {
  const main = points[0];
  const others = points.slice(1);

  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* breadcrumb (shadcn) */}
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
      <p className="mt-1 text-sm text-muted-foreground">ช่องทางติดต่อสำนักสาธารณสุขและสิ่งแวดล้อม เทศบาลนครนนทบุรี และแบบฟอร์มอีเมลสำหรับส่งข้อความถึงเรา</p>
      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2">
        {/* ฟอร์ม (Client) */}
        <Card className="order-2 md:order-1">
          <CardHeader><CardTitle>ส่งข้อความผ่านอีเมล</CardTitle></CardHeader>
          <CardContent><ContactForm /></CardContent>
        </Card>

        {/* การ์ดสถานที่ติดต่อ */}
        <div className="order-1 md:order-2 space-y-4">
          <ContactCard point={main} />
          {others.map((p) => <ContactCard key={p.title} point={p} />)}
        </div>
      </div>
    </section>
  );
}
