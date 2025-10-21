"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import PersonCard from "./PersonCard";
import type { Personnel, Mgmt } from "./types";
import { toMgmt } from "./utils";

type Props = { items: Array<Personnel | Mgmt> };

export default function PersonClient({ items }: Props) {
    // normalize เป็น Mgmt เสมอ
    const normalized: Mgmt[] = useMemo(() => items.map(toMgmt), [items]);

    const [q, setQ] = useState("");
    const [dept, setDept] = useState<string>("all");

    const departments = useMemo(() => {
        const set = new Set(normalized.map((i) => i.departmentLabel).filter(Boolean) as string[]);
        return ["all", ...Array.from(set)];
    }, [normalized]);

    const filtered = useMemo(() => {
        return normalized
            .filter((i) =>
                q
                    ? (i.fullName + " " + (i.positionName ?? "") + " " + (i.departmentLabel ?? ""))
                        .toLowerCase()
                        .includes(q.toLowerCase())
                    : true
            )
            .filter((i) => (dept === "all" ? true : i.departmentLabel === dept));
    }, [normalized, q, dept]);

    const L1 = filtered.filter((i) => i.level === 1);
    const L2 = filtered.filter((i) => i.level === 2);
    const L3 = filtered.filter((i) => i.level === 3);

    const director = L1[0] ?? null;

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <Card>
                <CardHeader className="pb-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-muted-foreground">ค้นหา/กรองรายชื่อคณะผู้บริหาร</div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                                placeholder="ค้นหาชื่อ/ตำแหน่ง/หน่วยงาน…"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-full sm:w-fit md:w-64"
                            />
                            <Select value={dept} onValueChange={setDept}>
                                <SelectTrigger className="w-full sm:w-fit md:max-w-56">
                                    <SelectValue placeholder="เลือกหน่วยงาน" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map((d) => (
                                        <SelectItem key={d} value={d}>
                                            {d === "all" ? "ทุกหน่วยงาน" : d}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                        ผลลัพธ์ {filtered.length.toLocaleString()} รายการ •
                        <span className="ml-2">ผอ.สำนัก <Badge variant="secondary" className="ml-1">{L1.length}</Badge></span>
                        <span className="ml-2">ผอ.ส่วน <Badge variant="secondary" className="ml-1">{L2.length}</Badge></span>
                        <span className="ml-2">หัวหน้าฝ่าย <Badge variant="secondary" className="ml-1">{L3.length}</Badge></span>
                        {dept !== "all" ? ` • หน่วยงาน: ${dept}` : ""}
                        {q ? ` • “${q}”` : ""}
                    </p>
                </CardContent>
            </Card>

            {/* ผอ.สำนัก */}
            <section id="level-1" aria-label="ผู้อำนวยการสำนัก" className="rounded-2xl border">
                <div className="flex items-center justify-between p-6 sm:p-8">
                    <h2 className="text-xl font-semibold tracking-tight">ผู้อำนวยการสำนัก</h2>
                    <Badge>ระดับ 1</Badge>
                </div>
                <Separator />
                <div className="p-6 sm:p-8">
                    {director ? (
                        <div className="grid gap-6 lg:grid-cols-[450px,1fr]">
                            <PersonCard item={director} highlight />
                            <div className="self-center space-y-3 text-sm text-muted-foreground">
                                <p>ผู้นำนโยบาย ขับเคลื่อนภารกิจด้านสุขภาพและสิ่งแวดล้อมของเมือง ให้ปลอดภัย เท่าเทียม และยั่งยืน</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">ไม่พบข้อมูลผู้อำนวยการสำนัก</p>
                    )}
                </div>
            </section>

            {/* ผอ.ส่วน */}
            <section id="level-2" aria-label="ผู้อำนวยการส่วน">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">ผู้อำนวยการส่วน</h2>
                    <Badge variant="outline">ระดับ 2</Badge>
                </div>
                {L2.length ? (
                    <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {L2.map((p) => (
                            <PersonCard key={`${p.id}-${p.fullName}`} item={p} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">ไม่พบข้อมูลผู้อำนวยการส่วน</p>
                )}
            </section>

            {/* หัวหน้าฝ่าย */}
            <section id="level-3" aria-label="หัวหน้าฝ่าย">
                <div className="mb-3 mt-2 flex items-center justify-between">
                    <h2 className="text-lg font-semibold tracking-tight">หัวหน้าฝ่าย</h2>
                    <Badge variant="outline">ระดับ 3</Badge>
                </div>
                {L3.length ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {L3.map((p) => (
                            <PersonCard key={`${p.id}-${p.fullName}`} item={p} />
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">ไม่พบข้อมูลหัวหน้าฝ่าย</p>
                )}
            </section>
        </div>
    );
}