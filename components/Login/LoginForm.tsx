"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import useFormLogin from "@/features/admin/hooks/Login/useFormLogin";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginForm() {
    const { formData, errors, isSubmitting, canSubmit, handleChange, handleSubmit } = useFormLogin();
    const [showPassword, setShowPassword] = useState(false);

    const handleRememberChange = (checked: boolean | "indeterminate") => {
        const syntheticEvent = {
            target: {
                name: "remember",
                value: String(Boolean(checked)),
            },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
    };

    const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        const { ok, submitted } = await handleSubmit(e);
        if (!submitted) return;
        if (ok) toast.success("เข้าสู่ระบบสำเร็จ");
        else toast.error("เข้าสู่ระบบล้มเหลว");
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="space-y-1 items-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Lock className="h-5 w-5 text-primary" aria-hidden />
                    </div>
                    <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
                </div>
                <CardDescription className="text-[12px] md:text-sm">ลงชื่อเข้าใช้เพื่อจัดการเนื้อหาในระบบหลังบ้าน</CardDescription>
            </CardHeader>

            {/* ใช้ <form> เพื่อรองรับ Enter submit และ a11y */}
            <form onSubmit={onSubmit}>
                <CardContent className="space-y-4">
                    {/* อีเมล */}
                    <div className="space-y-2">
                        <Label htmlFor="email">อีเมล</Label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                placeholder="example@nonthaburi.go.th"
                                value={formData.email}
                                onChange={handleChange}
                                className="pl-9"
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                            />
                        </div>
                        {errors.email && (
                            <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
                        )}
                    </div>

                    {/* รหัสผ่าน */}
                    <div className="space-y-2">
                        <Label htmlFor="password">รหัสผ่าน</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className="pr-10"
                                aria-invalid={!!errors.password}
                                aria-describedby={errors.password ? "password-error" : undefined}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (<p id="password-error" className="text-sm text-destructive">{errors.password}</p>)}
                    </div>

                    {/* จำฉันไว้ + ลิงก์ช่วยเหลือ */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                onCheckedChange={handleRememberChange}
                            />
                            <span className="text-sm">จำฉันไว้</span>
                        </label>
                        <a href="/auth/forgot" className="text-sm text-primary underline-offset-4 hover:underline">
                            ลืมรหัสผ่าน?
                        </a>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                    <Button
                        className="w-full"
                        type="submit"
                        disabled={!canSubmit}
                        aria-disabled={!canSubmit}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        เข้าสู่ระบบ
                    </Button>

                    {/* คำเตือนนโยบายความปลอดภัย */}
                    <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                        <ShieldAlert className="mt-0.5 h-4 w-4" aria-hidden />
                        <p>
                            การใช้งานระบบนี้จำกัดสำหรับเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น
                            การเข้าสู่ระบบถือว่ายอมรับ{" "}
                            <a
                                href="/policies/security"
                                className="text-primary underline-offset-4 hover:underline"
                            >
                                นโยบายความปลอดภัยและการคุ้มครองข้อมูล
                            </a>{" "}
                            ของเทศบาลฯ การกระทำที่ฝ่าฝืนอาจถูกบันทึกและดำเนินการตามระเบียบ
                        </p>
                    </div>
                </CardFooter>
            </form>
        </Card>
    );
}