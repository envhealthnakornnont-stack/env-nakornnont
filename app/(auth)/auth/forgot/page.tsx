// ❗ Server Component (ไม่มี "use client")
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import ContactActions from "@/components/Forgot/ContactActions";

// ✅ อ่าน environment ฝั่งเซิร์ฟเวอร์ แล้วส่งเป็น props ปกติให้ Client Component
const ADMIN_EMAIL = "behn@hotmail.co.th";
const ADMIN_PHONE = "02-589-0500";
const ADMIN_CHAT  = "";

export const metadata: Metadata = {
  title: "ลืมรหัสผ่าน | ติดต่อผู้ดูแลระบบ",
  description:
    "ไม่มีระบบรีเซ็ตรหัสผ่านอัตโนมัติ โปรดติดต่อผู้ดูแลระบบเพื่อยืนยันตัวตนและช่วยกู้เข้าระบบ",
  robots: { index: false, follow: false },
};


export default function ForgotPage() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
        <div className="mb-6">
          <Link
            href="/auth/secure/gateway/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ลืมรหัสผ่าน</CardTitle>
            <CardDescription>
              ระบบนี้ยังไม่มีฟังก์ชันกู้รหัสผ่านอัตโนมัติ โปรดติดต่อผู้ดูแลระบบเพื่อช่วยยืนยันตัวตนและตั้งค่าบัญชีใหม่
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ✅ เอา interactivity ไปไว้ใน Client Component */}
            <ContactActions
              adminEmail={ADMIN_EMAIL}
              adminPhone={ADMIN_PHONE}
              adminChat={ADMIN_CHAT}
            />

            <Separator />

            <section>
              <h2 className="text-base font-semibold">ข้อมูลที่ควรแจ้งเพื่อยืนยันตัวตน</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>ชื่อ–สกุล และหน่วยงาน/ฝ่าย</li>
                <li>รหัสพนักงาน หรืออีเมลองค์กร</li>
                <li>ชื่อผู้ใช้ (ถ้ามี) และเวลาที่พยายามเข้าสู่ระบบล่าสุด</li>
                <li>สาเหตุโดยสังเขป เช่น “ลืมรหัสผ่าน” หรือ “บัญชีถูกล็อก”</li>
              </ul>
            </section>

            <Separator />

            <section className="rounded-lg border bg-muted/40 p-4">
              <div className="flex items-start">
                <ShieldCheck className="mr-3 mt-0.5 h-5 w-5" />
                <div>
                  <h3 className="text-sm font-semibold">ข้อควรระวังด้านความปลอดภัย</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    <li>อย่าบอก “รหัสผ่านเดิม” ผ่านอีเมล/แชต/โทรศัพท์</li>
                    <li>ตั้งรหัสผ่านใหม่ที่คาดเดายากและไม่ซ้ำระบบอื่น</li>
                    <li>หากสงสัยบัญชีถูกบุกรุก แจ้งผู้ดูแลทันที</li>
                  </ul>
                </div>
              </div>
            </section>

            <div className="text-sm text-muted-foreground">
              * หมายเหตุ: อาจมีการบันทึกคำขอและข้อมูลอุปกรณ์เพื่อการตรวจสอบความปลอดภัย
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
