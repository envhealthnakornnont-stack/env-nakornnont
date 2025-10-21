"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const FormSchema = z.object({
  name: z.string().min(2, "กรุณาระบุชื่อ"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  phone: z.string().optional(),
  subject: z.string().min(3, "กรุณาระบุเรื่อง"),
  message: z.string().min(10, "กรุณาระบุข้อความอย่างน้อย 10 ตัวอักษร"),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

type FormValues = z.infer<typeof FormSchema>;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { website: "" },
  });

  const onSubmit = async (data: FormValues) => {
    // แสดงสถานะระหว่างส่ง แล้วเก็บ id ไว้อัปเดตภายหลัง
    const tid = toast.loading("กำลังส่งข้อความ...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // พยายามอ่าน error จากฝั่งเซิร์ฟเวอร์ (ถ้ามี)
      if (!res.ok) {
        let detail = "";
        try {
          const j = await res.json();
          if (j?.error) detail = ` (${j.error})`;
        } catch {
          throw new Error(`failed${detail}`);
        }
        throw new Error(`ส่งไม่สำเร็จ${detail}`);
      }

      // สำเร็จ
      toast.success("ส่งสำเร็จ ขอบคุณที่ติดต่อเรา", { id: tid });
      reset();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
      toast.error(msg, { id: tid });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* honeypot */}
      <input type="text" {...register("website")} className="hidden" aria-hidden />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">ชื่อ–สกุล</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">อีเมล</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="phone">เบอร์โทร (ถ้ามี)</Label>
        <Input id="phone" inputMode="tel" placeholder="0XXXXXXXXX" {...register("phone")} />
      </div>

      <div>
        <Label htmlFor="subject">เรื่อง</Label>
        <Input id="subject" {...register("subject")} />
        {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <Label htmlFor="message">ข้อความ</Label>
        <Textarea id="message" rows={15} {...register("message")} />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message.message}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "กำลังส่ง..." : "ส่งข้อความ"}
        </Button>
      </div>
    </form>
  );
}
