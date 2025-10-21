"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

type Props = {
  title: string;
  updatedAt?: string; // YYYY-MM-DD
  children: React.ReactNode;
};

export default function PolicyLayout({ title, updatedAt, children }: Props) {
  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* breadcrumb สั้น */}
      <Breadcrumb className="mb-4 text-sm text-muted-foreground">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="hover:text-foreground">หน้าหลัก</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      {updatedAt ? (
        <p className="mt-1 text-xs text-muted-foreground">
          ปรับปรุงล่าสุด: {new Date(updatedAt).toLocaleDateString("th-TH")}
        </p>
      ) : null}

      <Separator className="my-6" />

      <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
        {children}
      </article>

      <Separator className="my-8" />
      <footer className="text-sm text-muted-foreground">
        มีข้อสงสัยเพิ่มเติม ติดต่อ: <Link href="/contact" className="underline">แบบฟอร์มติดต่อสำนัก</Link> หรืออีเมล
        <span className="whitespace-nowrap"> Env.health.nakornnont@gmail.com</span>
      </footer>
    </section>
  );
}
