import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function LoginAside() {
    return (
        <div className="relative hidden md:flex flex-col overflow-hidden bg-muted/40 dark:bg-muted/30">
            {/* แสงไล่เฉด */}
            <div
                aria-hidden
                className="pointer-events-none absolute -inset-32 rounded-[100%] bg-gradient-to-br from-emerald-400/20 via-sky-400/20 to-fuchsia-400/20 blur-3xl"
            />

            <div className="relative z-10 flex flex-1 flex-col p-10">
                <div className="mb-8 flex items-center gap-3">
                    <Image
                        src="/mobile/mobile-logo.png"
                        alt="โลโก้เทศบาลนครนนทบุรี"
                        width={40}
                        height={40}
                        className="rounded-md"
                        priority
                    />
                    <div>
                        <p className="text-sm text-muted-foreground">สำนักสาธารณสุขและสิ่งแวดล้อม</p>
                        <h2 className="text-lg font-semibold">เทศบาลนครนนทบุรี</h2>
                    </div>
                </div>

                <div className="mt-auto space-y-4">
                    <h3 className="text-2xl font-bold leading-tight">
                        แดชบอร์ดหลังบ้านที่ปลอดภัย
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        จัดการข่าว กิจกรรม เอกสาร และบริการสาธารณะได้ในที่เดียว
                    </p>

                    <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4" />
                            สิทธิ์ตามบทบาท (Role-based) และติดตามสถานะเนื้อหาได้ชัดเจน
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4" />
                            รองรับมือถือเต็มรูปแบบ โหลดไว ใช้งานง่าย
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4" />
                            การออกแบบสมัยใหม่ เข้ากับ Dark Mode
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}