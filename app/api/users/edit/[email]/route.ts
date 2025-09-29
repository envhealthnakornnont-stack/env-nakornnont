import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import slugify from "slugify";

// Helper function สำหรับบันทึกไฟล์ avatar ลงในโฟลเดอร์ที่กำหนดภายใต้ public/uploads/avatar
async function saveFileBuffer(
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
    // คืนค่า URL สำหรับเข้าถึงไฟล์ (relative path จาก public)
    return `/uploads/avatar/${folderPath}/${filename}`;
}

function deleteFileAndFolderIfEmpty(fileUrl: string): void {
    if (!fileUrl || fileUrl.trim() === "") return;
  
    const filePath = path.join(process.cwd(), fileUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log("Deleted file:", filePath);
  
        // ลองลบโฟลเดอร์ถ้าไม่มีไฟล์เหลืออยู่
        const folderPath = path.dirname(filePath);
        const files = fs.readdirSync(folderPath);
        if (files.length === 0) {
          fs.rmdirSync(folderPath);
          console.log("Deleted empty folder:", folderPath);
        }
      } catch (err) {
        console.error("Failed to delete file or folder:", err);
      }
    }
  }
  

export async function PUT(req: NextRequest, { params }: { params: Promise<{ email: string }> }) {
    try {
        // ตรวจสอบว่า Session ถูกต้องหรือไม่
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "ไม่ได้รับอนุญาต" }, { status: 401 });
        }

        // รับค่า email จาก URL params
        const { email } = await params
        if (!email) {
            return NextResponse.json({ error: "จำเป็นต้องมีค่า Email จาก URL Params" }, { status: 400 });
        }

        // รับข้อมูลจาก FormData
        const form = await req.formData();
        const firstname = form.get("firstname") as string;
        const lastname = form.get("lastname") as string;
        const emailInput = form.get("email") as string;
        const emailBody = emailInput.trim().toLowerCase();
        const department = form.get("department") as string;
        const role = form.get("role") as "USER" | "SUPERUSER";
        const password = form.get("password") as string;
        const avatarField = form.get("avatar") as File;

        // ตรวจสอบว่ามีค่าที่จำเป็นหรือไม่
        const missingFields: string[] = [];
        if (!firstname || !firstname.trim()) {
            missingFields.push("ชื่อจริง");
        }
        if (!lastname || !lastname.trim()) {
            missingFields.push("นามสกุล");
        }
        if (!email || !email.trim()) {
            missingFields.push("อีเมล");
        }
        if (!department || !department.trim()) {
            missingFields.push("แผนก");
        }
        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // หากส่ง email ใน body มาแล้วให้ตรวจสอบว่า สอดคล้องกับ email จาก params
        if (emailBody && emailBody !== email) {
            return NextResponse.json({ error: "อีเมลในที่ส่งมาไม่ตรงกับอีเมลใน URL" }, { status: 400 });
        }

        // ตรวจสอบรูปแบบอีเมล
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "รูปแบบอีเมล์ไม่ถูกต้อง" }, { status: 400 });
        }

        // หากมีการส่ง password เข้ามา ให้ validate ด้วย regex
        if (password && password.trim() !== "") {
            // Regex ใหม่: ต้องมีอย่างน้อย 12 ตัวอักษร พร้อมด้วยตัวพิมพ์เล็ก, พิมพ์ใหญ่, ตัวเลข และอักขระพิเศษ @$!%*?&#
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{12,}$/;
            if (!passwordRegex.test(password)) {
                return NextResponse.json(
                    { error: "รหัสผ่านต้องมีอย่างน้อย 12 ตัวอักษร และประกอบด้วยตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข และอักขระพิเศษ @$!%*?&#" },
                    { status: 400 }
                );
            }
        }

        // ตรวจสอบสิทธิ์: SUPERUSER สามารถแก้ไขข้อมูลของทุกคนได้ แต่ USER สามารถแก้ไขได้เฉพาะของตัวเองเท่านั้น
        const isSuperuser = session.user.role === "SUPERUSER";
        const isOwner = Number(session.user.id) === Number(session.user.id);
        if (!isSuperuser && !isOwner) {
            return NextResponse.json(
                { error: "ไม่ได้รับอนุญาต: คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้อื่น" },
                { status: 403 }
            );
        }

        // ตรวจสอบว่าอีเมลไม่ซ้ำ (ยกเว้นอีเมลเดิมของผู้ใช้)
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (!existingUser) {
            return NextResponse.json({ error: "ไม่พบผู้ใช้งานที่มีอีเมลนี้" }, { status: 404 });
        }

        // ถ้ามีไฟล์ avatar ที่ส่งมาให้ประมวลผลอัปโหลด
        let avatarUrl: string | undefined;
        if (avatarField instanceof File && avatarField.size > 0) {
            // ตรวจสอบชนิดของไฟล์
            if (!avatarField.type.startsWith("image/")) {
                return NextResponse.json({ error: "ไฟล์ avatar ต้องเป็นรูปภาพ" }, { status: 400 });
            }
            // ตรวจสอบขนาด (ไม่เกิน 500KB)
            if (avatarField.size > 500 * 1024) {
                return NextResponse.json({ error: "ไฟล์ avatar ต้องมีขนาดไม่เกิน 500 KB" }, { status: 400 });
            }
            // ลบไฟล์ avatar เก่า ถ้ามี
            if (existingUser.avatar) {
                deleteFileAndFolderIfEmpty(existingUser.avatar);
            }
            // ดำเนินการประมวลผลต่อ (อ่าน buffer ฯลฯ)
            const buffer = Buffer.from(await avatarField.arrayBuffer());
            // ... สร้าง folder และ filename ตามที่ต้องการ
            const folder = uuidv4();
            const ext = path.extname(avatarField.name);
            const baseName = slugify(path.basename(avatarField.name, ext), { lower: true, strict: true });
            const filename = `${Date.now()}-${baseName}${ext}`;
            avatarUrl = await saveFileBuffer(buffer, folder, filename);
        }


        // สร้าง object สำหรับข้อมูลการอัปเดต
        const updateData: { firstname: string; lastname: string; email: string; department: string; password?: string; avatar?: string; role?: "USER" | "SUPERUSER" } = { firstname, lastname, email: email, department };

        // หากมีการส่ง password ที่ผ่านการ validate ให้ทำการ hash แล้วบันทึก
        if (password && password.trim() !== "") {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            updateData.password = hashedPassword;
        }

        // ถ้ามี avatar ที่ใหม่ ให้เพิ่มเข้ามา
        if (avatarUrl) {
            updateData.avatar = avatarUrl;
        }
        // เฉพาะ SUPERUSER เท่านั้นที่สามารถแก้ไข role ได้
        if (isSuperuser && role) {
            updateData.role = role;
        }

        // ทำการอัปเดตข้อมูลผู้ใช้งานในฐานข้อมูล (ใช้ email เป็น key เนื่องจาก email เป็น unique)
        const updatedUser = await prisma.user.update({
            where: { email: email },
            data: updateData,
        });

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "ไม่สามารถอัพเดตผู้ใช้ได้" }, { status: 500 });
    }
}
