"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, ClipboardCopy } from "lucide-react";
import { toast } from "sonner";

type Props = {
    adminEmail: string;
    adminPhone: string;
    adminChat?: string;
};

export default function ContactActions({ adminEmail, adminPhone, adminChat }: Props) {
    const mailto = `mailto:${adminEmail}?subject=${encodeURIComponent("ขอความช่วยเหลือ: ลืมรหัสผ่าน")}`;
    const tel = `tel:${adminPhone.replace(/[^0-9+]/g, "")}`;

    const copyText = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`คัดลอก${label}แล้ว`);
        } catch {
            toast.error(`คัดลอก${label}ไม่สำเร็จ`);
        }
    };

    return (
        <section>
            <h2 className="text-base font-semibold">ช่องทางติดต่อผู้ดูแลระบบ</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <Button asChild variant="secondary">
                    <a href={mailto}><Mail className="mr-2 h-4 w-4" /> ส่งอีเมล</a>
                </Button>

                <Button variant="outline" onClick={() => copyText(adminEmail, "อีเมลผู้ดูแล")}>
                    <ClipboardCopy className="mr-2 h-4 w-4" /> คัดลอกอีเมล
                </Button>

                <Button asChild variant="secondary">
                    <a href={tel}><Phone className="mr-2 h-4 w-4" /> โทรหาแอดมิน</a>
                </Button>

                <Button variant="outline" onClick={() => copyText(adminPhone, "หมายเลขโทรศัพท์")}>
                    <ClipboardCopy className="mr-2 h-4 w-4" /> คัดลอกเบอร์โทร
                </Button>

                {adminChat ? (
                    <Button asChild variant="secondary" className="sm:col-span-2">
                        <a href={adminChat} target="_blank" rel="noreferrer">เปิดห้องแชต/ระบบรับแจ้ง</a>
                    </Button>
                ) : null}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
                อีเมล: <span className="font-medium">{adminEmail}</span> · โทร: <span className="font-medium">{adminPhone}</span>
            </p>
        </section>
    );
}
