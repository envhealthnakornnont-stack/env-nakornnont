import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

/** ให้รันบน Node.js runtime (ไม่ใช่ Edge) */
export const runtime = "nodejs";
/** เนื้อหาฟอร์มต้องประมวลผลฝั่งเซิร์ฟเวอร์เสมอ */
export const dynamic = "force-dynamic";

/* ---------- 1) Validation schema + anti-bot ---------- */
const FormSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().nullable(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});


/* ---------- 2) Simple rate limit in-memory (per IP) ---------- */
const RATE_WINDOW_MS = 30_000; // 30 วินาทีต่อ 1 คำขอ
type GlobalWithMail = typeof globalThis & {
  __contactIpHits?: Map<string, number>;
  __transporter?: nodemailer.Transporter;
};
const g = globalThis as GlobalWithMail;

const ipHits: Map<string, number> = g.__contactIpHits ?? new Map<string, number>();
g.__contactIpHits = ipHits;

function rateLimited(ip: string) {
  const last = ipHits.get(ip) ?? 0;
  const now = Date.now();
  if (now - last < RATE_WINDOW_MS) return true;
  ipHits.set(ip, now);
  return false;
}


/* ---------- 3) Nodemailer transporter (singleton) ---------- */
function getTransporter(): nodemailer.Transporter {
  if (!g.__transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure = process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465;

    g.__transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // eg. "smtp.gmail.com"
      port,
      secure, // true = 465, false = 587/25
      auth: {
        user: process.env.SMTP_USER, // eg. your@gmail.com
        pass: process.env.SMTP_PASS, // App Password / SMTP password
      },
    });
  }
  return g.__transporter;
}

/* ---------- 4) Handler ---------- */
export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (rateLimited(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = FormSchema.safeParse(body);

    // honeypot หรือ invalid
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }
    if (parsed.data.website) {
      return NextResponse.json({ ok: true }); // bot กดก็ทำเหมือนไม่มีอะไรเกิดขึ้น
    }

    const { name, email, phone, subject, message } = parsed.data;

    // ป้องกัน subject injection ง่าย ๆ
    const safeSubject = subject.replace(/(\r|\n)/g, " ").slice(0, 180);

    const transporter = getTransporter();

    const to = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
    if (!to) {
      return NextResponse.json({ ok: false, error: "no_recipient_config" }, { status: 500 });
    }

    // เนื้อหาอีเมล (มีทั้ง text และ html)
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      `Subject: ${safeSubject}`,
      `Message:`,
      message,
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;font-size:14px">
        <h3 style="margin:0 0 8px">ข้อความใหม่จากแบบฟอร์มติดต่อ</h3>
        <p><strong>ชื่อ:</strong> ${escapeHtml(name)}</p>
        <p><strong>อีเมล:</strong> ${escapeHtml(email)}</p>
        <p><strong>โทร:</strong> ${escapeHtml(phone || "-")}</p>
        <p><strong>เรื่อง:</strong> ${escapeHtml(safeSubject)}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0" />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    const fromAddress =
      process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@localhost";

    await transporter.sendMail({
      from: fromAddress, // ผู้ส่ง
      to,                // ผู้รับปลายทาง (หน่วยงาน)
      subject: `[Contact] ${safeSubject}`,
      text,
      html,
      replyTo: email,    // ให้ตอบกลับไปหาผู้กรอกฟอร์มได้ทันที
    });

    // ไม่ log ข้อมูลส่วนตัวลง console ในโปรดักชัน
    // console.log("mail-id", info.messageId);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

/* ---------- utils ---------- */
function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
