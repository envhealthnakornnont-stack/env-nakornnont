"use client";

import Image from "next/image";
import Link from "next/link";
import { departments, type DeptKey } from "@/lib/departments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

type Props = { dept: DeptKey };

export default function DepartmentPage({ dept }: Props) {
    const d = departments[dept];

    const trail = [
        { label: "หน้าแรก", href: "/" },
        { label: d.title, href: `/departments/${d.slug}`, current: true },
    ];

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
            <nav aria-label="Breadcrumb" className="mb-2">
                <Breadcrumb>
                    <BreadcrumbList className="text-sm">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={trail[0].href}>{trail[0].label}</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{trail[1].label}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </nav>
            {/* HERO */}
            <section className="relative overflow-hidden rounded-2xl border">
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-100/80 via-sky-100/60 to-indigo-100/70" />
                {d.hero.image ? (
                    <div className="absolute inset-0 -z-10 opacity-25">
                        {/* LCP-friendly */}
                        <Image
                            src={d.hero.image}
                            alt={d.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : null}

                <div className="p-6 md:p-10">
                    {d.hero.badge && <Badge variant="secondary" className="mb-3">{d.hero.badge}</Badge>}
                    <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{d.title}</h1>
                    {d.subtitle && (
                        <p className="mt-2 text-muted-foreground md:text-lg leading-relaxed">
                            {d.subtitle}
                        </p>
                    )}

                    {/* Quick actions */}
                    <div className="mt-6 flex flex-wrap gap-2">
                        <a href="#missions"><Button size="sm" variant="default">ภารกิจ</Button></a>
                        <a href="#services"><Button size="sm" variant="secondary">บริการ</Button></a>
                        {!!d.downloads?.length && <a href="#downloads"><Button size="sm" variant="outline">แบบฟอร์ม/คู่มือ</Button></a>}
                        <a href="#contact"><Button size="sm" variant="ghost">ติดต่อ</Button></a>
                    </div>

                    {/* KPIs */}
                    {d.kpis?.length ? (
                        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
                            {d.kpis.map((k) => (
                                <Card key={k.label} className="shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="text-xl md:text-2xl font-semibold">{k.value}</div>
                                        <div className="text-sm text-muted-foreground">{k.label}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {/* CONTENT GRID */}
            <section className="grid gap-6 md:grid-cols-3">
                {/* LEFT: main content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Missions */}
                    <Card id="missions" className="scroll-mt-28 md:scroll-mt-32">
                        <CardHeader>
                            <CardTitle>ภารกิจ/หน้าที่</CardTitle>
                            <CardDescription>สิ่งที่หน่วยงานรับผิดชอบเป็นประจำ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-3">
                                {d.missions.map((m, i) => (
                                    <li key={i} className="rounded-lg border p-3 leading-relaxed bg-muted/30">
                                        {m}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Services */}
                    <Card id="services" className="scroll-mt-28 md:scroll-mt-32">
                        <CardHeader>
                            <CardTitle>บริการ/งานหลัก</CardTitle>
                            <CardDescription>เข้าถึงบริการออนไลน์และข้อมูลที่เกี่ยวข้อง</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            {d.services.map((s) => (
                                <Link key={s.title} href={s.link || "#"} className="group">
                                    <div className="rounded-xl border p-4 transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
                                        <div className="font-medium">{s.title}</div>
                                        {s.desc && <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>}
                                        <div className="mt-3 text-sm underline underline-offset-4">ดูรายละเอียด</div>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Downloads */}
                    {d.downloads?.length ? (
                        <Card id="downloads" className="scroll-mt-28 md:scroll-mt-32">
                            <CardHeader>
                                <CardTitle>แบบฟอร์ม/คู่มือ/ระเบียบ</CardTitle>
                                <CardDescription>ไฟล์ที่ต้องใช้บ่อย อัปเดตล่าสุด</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {d.downloads.map((f) => (
                                    <Link
                                        key={f.href}
                                        href={f.href}
                                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/40 transition"
                                    >
                                        <div>
                                            <div className="font-medium">{f.name}</div>
                                            {(f.size || f.updatedAt) && (
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {f.size ? `ขนาด ${f.size}` : ""}{f.size && f.updatedAt ? " · " : ""}{f.updatedAt ? `อัปเดต ${f.updatedAt}` : ""}
                                                </div>
                                            )}
                                        </div>
                                        <Button size="sm" variant="secondary">ดาวน์โหลด</Button>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    ) : null}

                    {/* FAQs */}
                    {d.faqs?.length ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>คำถามที่พบบ่อย</CardTitle>
                                <CardDescription>ตอบสั้น ชัด ตรงประเด็น</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {d.faqs.map((f, i) => (
                                        <AccordionItem key={i} value={`faq-${i}`}>
                                            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
                                            <AccordionContent className="leading-relaxed">{f.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ) : null}
                </div>

                {/* RIGHT: contact & highlights */}
                <div className="space-y-6">
                    <Card id="contact" className="scroll-mt-28 md:scroll-mt-32">
                        <CardHeader>
                            <CardTitle>ติดต่อหน่วยงาน</CardTitle>
                            <CardDescription>ช่องทางประสานงาน</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {d.contacts?.map((c) => (
                                <div key={c.name} className="rounded-lg border p-3">
                                    <div className="font-medium">{c.name}</div>
                                    {c.role && <div className="text-sm">{c.role}</div>}
                                    <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                        {c.phone && <div>โทร: {c.phone}</div>}
                                        {c.email && <div>อีเมล: {c.email}</div>}
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="text-xs text-muted-foreground">
                                เวลาราชการ: จันทร์–ศุกร์ 08:30–16:30 น. (เว้นวันหยุดราชการ)
                            </div>
                        </CardContent>
                    </Card>

                    {d.highlights?.length ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>ไฮไลต์ล่าสุด</CardTitle>
                                <CardDescription>ข่าว/กิจกรรมที่เกี่ยวข้อง</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {d.highlights.map((h) => (
                                    <Link key={h.href} href={h.href} className="block rounded-lg border p-3 hover:bg-muted/40">
                                        <div className="font-medium">{h.label}</div>
                                        <div className="text-xs underline underline-offset-4 mt-1">อ่านต่อ</div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
