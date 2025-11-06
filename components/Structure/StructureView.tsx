"use client";

import * as React from "react";
import Link from "next/link";
import { Building2, Users2, GitBranch, Download, Search, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import OrgTree from "./OrgTree";
import LeadershipGrid from "./LeadershipGrid";
import StructureDiagram from "./StructureDiagram";
import { orgUnits, leaders, documents } from "./types";

export default function StructureView() {
    const [q, setQ] = React.useState("");
    const filteredUnits = React.useMemo(() => {
        const k = q.trim().toLowerCase();
        if (!k) return orgUnits;
        return orgUnits.filter((u) =>
            [u.name, u.description, ...(u.tags ?? [])].some((s) => typeof s === "string" && s.toLowerCase().includes(k))
        );
    }, [q]);

    return (
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-2">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">หน้าแรก</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>โครงสร้างองค์กร</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </nav>

            {/* Hero */}
            <Card className={cn(
                "relative overflow-hidden border bg-gradient-to-br",
                "from-background to-muted/70 dark:from-background dark:to-muted/40"
            )}>
                <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-start gap-3">
                        <Badge variant="secondary" className="inline-flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" /> โครงสร้างหน่วยงาน
                        </Badge>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl">สำนักสาธารณสุขและสิ่งแวดล้อม</CardTitle>
                    <CardDescription className="max-w-3xl">
                        ภาพรวมสายการบังคับบัญชา หน้าที่ความรับผิดชอบ และหน่วยงานย่อย เพื่อความโปร่งใสและเข้าถึงง่าย
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                    <div className="flex flex-col md:flex-row md:gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users2 className="h-4 w-4" />
                            หน่วยงานย่อยทั้งหมด <span className="font-medium text-foreground">{orgUnits.length}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GitBranch className="h-4 w-4" />
                            สายการบังคับบัญชาหลัก <span className="font-medium text-foreground">1</span>
                        </div>
                    </div>
                </CardContent>
                <div aria-hidden className="pointer-events-none absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-primary/10 blur-2xl" />
            </Card>

            {/* Search & downloads */}
            <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="ค้นหาหน่วยงาน / หน้าที่ / แท็ก"
                        className="pl-8"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {documents.map((d) => (
                        <Button asChild key={d.href} variant="outline" size="sm">
                            <Link href={d.href} prefetch={false}>
                                <Download className="mr-2 h-4 w-4" /> {d.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="max-w-full w-auto justify-start overflow-x-auto">
                    <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                    <TabsTrigger value="tree">ผังหน่วยงาน</TabsTrigger>
                    <TabsTrigger value="diagram">ไดอะแกรม</TabsTrigger>
                    <TabsTrigger value="docs">หน้าที่/ความรับผิดชอบ</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>ผู้บริหารและหัวหน้าหน่วยงาน</CardTitle>
                                    <CardDescription>
                                        รายชื่อผู้ดูแลรับผิดชอบและช่องทางติดต่อหลักของหน่วยงาน
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <LeadershipGrid leaders={leaders} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>หน่วยงานย่อย</CardTitle>
                                    <CardDescription>
                                        รายการหน่วยงานทั้งหมดที่สังกัดสำนัก พร้อมคำอธิบายสั้น
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="pr-4">
                                        <ul className="grid gap-3 sm:grid-cols-2">
                                            {filteredUnits.map((u) => (
                                                <li key={u.key} className="rounded-xl border p-4">
                                                    <div className="flex flex-col items-start justify-between gap-2">
                                                        {u.badge && <Badge variant="secondary">{u.badge}</Badge>}
                                                        <div>
                                                            <div className="font-medium leading-tight">{u.name}</div>
                                                            <p className="text-sm text-muted-foreground mt-1">{u.description}</p>
                                                        </div>
                                                    </div>
                                                    {u.tags && (
                                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                                            {u.tags.map((t) => (
                                                                <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>ไฟล์เอกสาร</CardTitle>
                                    <CardDescription>ดาวน์โหลดผังโครงสร้างในรูปแบบ PDF/PNG</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-2">
                                        {documents.map((d) => (
                                            <Button asChild key={d.href} variant="secondary">
                                                <Link href={d.href}>
                                                    <Download className="mr-2 h-4 w-4" /> {d.label}
                                                </Link>
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>หมายเหตุ</CardTitle>
                                    <CardDescription>
                                        ภาพรวมนี้เป็นผังเชิงข้อมูล มิใช่คำสั่งทางปกครอง
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-sm text-muted-foreground space-y-2">
                                    <p className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4" /> การปรับปรุงหน่วยงานอาจมีการเปลี่ยนแปลงตามคำสั่งล่าสุด</p>
                                    <p className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4" /> ช่องทางติดต่ออย่างเป็นทางการระบุในหน้า &quot;ติดต่อเรา&quot;</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tree" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>ผังหน่วยงานแบบต้นไม้</CardTitle>
                            <CardDescription>ยุบ/ขยายได้ เหมาะกับมือถือและเครื่องอ่านหน้าจอ</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrgTree data={orgUnits} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="diagram" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>โครงสร้างแบบไดอะแกรม</CardTitle>
                            <CardDescription>ปรับขนาด/เลื่อนดูได้</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StructureDiagram />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="docs" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>หน้าที่และความรับผิดชอบ</CardTitle>
                            <CardDescription>สรุปความรับผิดชอบหลักของแต่ละหน่วย</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {orgUnits.map((u) => (
                                    <div key={u.key} className="rounded-xl border p-4">
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-2">
                                            <div>
                                                <h3 className="font-semibold leading-tight">{u.name}</h3>
                                                <p className="text-sm text-muted-foreground mt-1">{u.description}</p>
                                            </div>
                                            {u.badge && <Badge variant="secondary">{u.badge}</Badge>}
                                        </div>
                                        {u.responsibilities && (
                                            <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
                                                {u.responsibilities.map((it, idx) => (
                                                    <li key={idx}>{it}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Separator className="my-8" />

            {/* CTA */}
            <div className="mb-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                    พบข้อผิดพลาดข้อมูล? โปรดแจ้งเพื่อปรับปรุงให้ถูกต้อง
                </p>
                <Button asChild>
                    <Link href="/contact">ติดต่อเรา</Link>
                </Button>
            </div>
        </div>
    );
}