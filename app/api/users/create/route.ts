import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { hash } from "bcrypt";

const SALT_ROUNDS = 10;

// Helper function สำหรับบันทึกไฟล์ avatar ลงในโฟลเดอร์ภายใต้ public/uploads/avatar
async function saveAvatarFile(
    buffer: Buffer,
    folderPath: string, // folderPath relative to public/uploads/avatar
    filename: string
): Promise<string> {
    const uploadsDir = path.join(process.cwd(), "uploads", "avatar", folderPath);
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
    // คืนค่า URL สำหรับเข้าถึงไฟล์ (relative จาก public)
    return `/uploads/avatar/${folderPath}/${filename}`;
}

export async function POST(req: NextRequest) {
    try {
        // ตรวจสอบ session และ role: ต้องเป็น SUPERUSER เท่านั้น
        const session = await getServerSession({ req, ...authOptions });
        if (!session || !session.user || session.user.role !== "SUPERUSER") {
            return NextResponse.json({ error: "Forbidden: มีเพียง SUPERUSER เท่านั้นที่สามารถเรียกใช้ API นี้ได้" }, { status: 403 });
        }

        // รับข้อมูลจาก FormData
        const form = await req.formData();
        const firstname = form.get("firstname") as string;
        const lastname = form.get("lastname") as string;
        const emailInput = form.get("email") as string;
        const email = emailInput.trim().toLowerCase();
        const password = form.get("password") as string;
        const department = form.get("department") as string;
        const role = form.get("role") as "USER" | "SUPERUSER";
        const avatarFile = form.get("avatar") as File;

        // ตรวจสอบว่าฟิลด์ที่จำเป็นครบถ้วน
        const missingFields: string[] = [];
        if (!firstname || !firstname.trim()) missingFields.push("firstname");
        if (!lastname || !lastname.trim()) missingFields.push("lastname");
        if (!email || !email.trim()) missingFields.push("email");
        if (!password || !password.trim()) missingFields.push("password");
        if (!department || !department.trim()) missingFields.push("department");
        if (!role || !role.trim()) missingFields.push("role");

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `กรุณากรอกข้อมูลให้ครบถ้วน: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // ตรวจสอบรูปแบบอีเมล
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "รูปแบบอีเมลไม่ถูกต้อง" }, { status: 400 });
        }

        // ตรวจสอบรหัสผ่าน: ต้องมีอย่างน้อย 12 ตัว อักขระต้องมีอย่างน้อยหนึ่งตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ @$!%*?&#
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{12,}$/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: "รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร รวมทั้งตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ (@$!%*?&#)" },
                { status: 400 }
            );
        }

        // ตรวจสอบว่าอีเมลนี้มีอยู่แล้วหรือไม่
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "มีผู้ใช้งานที่ใช้ email นี้อยู่แล้ว" }, { status: 400 });
        }

        // แปลงรหัสผ่านก่อนเก็บลงฐานข้อมูล
        const hashedPassword = await hash(password, SALT_ROUNDS);

        // บันทึกไฟล์ avatar ลงในโฟลเดอร์: สร้าง random folder ด้วย uuid
        let avatarUrl = "";
        if (avatarFile && avatarFile.size > 0) {
            if (!avatarFile.type.startsWith("image/")) {
                return NextResponse.json({ error: "ไฟล์ avatar ต้องเป็นรูปภาพ" }, { status: 400 });
            }
            const maxSizeInBytes = 500 * 1024;
            if (avatarFile.size > maxSizeInBytes) {
                return NextResponse.json({ error: "ขนาดไฟล์ avatar ต้องไม่เกิน 500 KB" }, { status: 400 });
            }

            const ext = path.extname(avatarFile.name);
            const baseName = slugify(path.basename(avatarFile.name, ext), { lower: true, strict: true });
            const filename = `${Date.now()}-${baseName}${ext}`;
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            avatarUrl = await saveAvatarFile(buffer, uuidv4(), filename);
        }

        // สร้าง record ผู้ใช้งานใหม่ในฐานข้อมูลโดยเก็บ avatarUrl ที่ได้จากการอัปโหลด
        const newUser = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password: hashedPassword,
                department,
                role,
                avatar: avatarUrl,
            },
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _password, ...userWithoutPassword } = newUser;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการสร้างผู้ใช้:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน", message: errorMessage },
            { status: 500 }
        );
    }
}