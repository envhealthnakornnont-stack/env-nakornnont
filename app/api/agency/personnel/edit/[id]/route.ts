import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Helper function สำหรับบันทึกไฟล์ลงในโฟลเดอร์ที่กำหนดภายใต้ public/uploads/agency/personnel
async function saveFileBuffer(
    buffer: Buffer,
    folderPath: string, // folderPath relative to public/uploads/agency/personnel
    filename: string
): Promise<string> {
    const uploadsDir = path.join(process.cwd(), "uploads", "agency", "personnel", folderPath);
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);
    // คืนค่า URL สำหรับเข้าถึงไฟล์ (relative path จาก public)
    return `/uploads/agency/personnel/${folderPath}/${filename}`;
}

// Helper function สำหรับลบไฟล์และลบโฟลเดอร์หากว่างเปล่า
function deleteFileAndCleanUp(fileUrl: string) {
    const filePath = path.join(process.cwd(), fileUrl);
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);

            // ลบโฟลเดอร์ cover หากว่าง
            const coverFolder = path.dirname(filePath);
            if (fs.existsSync(coverFolder) && fs.readdirSync(coverFolder).length === 0) {
                fs.rmdirSync(coverFolder);
                console.log(`Deleted folder: ${coverFolder}`);
            }

            // ลบโฟลเดอร์หลัก (personnel folder) หากว่าง
            const personnelFolder = path.dirname(coverFolder);
            if (fs.existsSync(personnelFolder) && fs.readdirSync(personnelFolder).length === 0) {
                fs.rmdirSync(personnelFolder);
                console.log(`Deleted folder: ${personnelFolder}`);
            }
        } catch (err) {
            console.error(`Failed to delete file or folder for ${filePath}:`, err);
        }
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // ตรวจสอบ session
        const session = await getServerSession({ req, ...authOptions });
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // จำกัดสิทธิ์ให้เฉพาะ SUPERUSER เท่านั้น
        if (session.user.role !== "SUPERUSER") {
            return NextResponse.json(
                { error: "Forbidden: Insufficient permissions" },
                { status: 403 }
            );
        }

        const { id } = await params;
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        // รับข้อมูลจาก FormData (multipart/form-data)
        const form = await req.formData();
        const nameTitle = form.get("nameTitle") as string;
        const firstName = form.get("firstName") as string;
        const lastName = form.get("lastName") as string;
        const position = form.get("position") as string;
        const positionName = form.get("positionName") as string;
        const department = form.get("department") as string;
        const coverImageFile = form.get("coverImage") as File;

        // ตรวจสอบความถูกต้องของข้อมูลที่จำเป็น
        if (!nameTitle || !firstName || !lastName || !position || !positionName) {
            return NextResponse.json(
                { error: "Missing required fields: nameTitle, firstName, lastName, position, positionName" },
                { status: 400 }
            );
        }

        // ดึงข้อมูลบุคลากรเดิมจากฐานข้อมูล
        const existingPersonnel = await prisma.agencyPersonnel.findUnique({
            where: { id },
        });
        if (!existingPersonnel) {
            return NextResponse.json({ error: "Personnel not found" }, { status: 404 });
        }

        let updatedImageUrl = existingPersonnel.image;
        // ถ้ามีการอัปโหลดไฟล์รูปใหม่
        if (coverImageFile) {
            // ลบไฟล์เก่า (และโฟลเดอร์ที่เกี่ยวข้อง) ถ้ามี
            if (existingPersonnel.image) {
                deleteFileAndCleanUp(existingPersonnel.image);
            }
            // พยายามดึง folder จาก URL ของไฟล์เก่า
            let personnelFolder = "";
            if (existingPersonnel.image) {
                const parts = existingPersonnel.image.split("/");
                // ตัวอย่าง URL: /uploads/agency/personnel/{folder}/cover/filename.jpg
                // เราต้องการใช้ส่วนที่ index 4 เป็น folder name
                if (parts.length >= 5) {
                    personnelFolder = parts[4];
                }
            }
            // ถ้าไม่พบ folder จากไฟล์เก่า ให้สร้างใหม่
            if (!personnelFolder) {
                personnelFolder = uuidv4();
            }
            const ext = path.extname(coverImageFile.name); // เช่น .jpg, .png
            const baseName = path.basename(coverImageFile.name, ext);
            // เปลี่ยนชื่อไฟล์ให้ปลอดภัย โดยแทนที่ช่องว่างด้วยเครื่องหมายขีดและแปลงเป็น lowercase
            const safeName = baseName.replace(/\s+/g, "-").toLowerCase();
            const filename = `${Date.now()}-${safeName}${ext}`;
            const buffer = Buffer.from(await coverImageFile.arrayBuffer());
            updatedImageUrl = await saveFileBuffer(buffer, `${personnelFolder}/cover`, filename);
        }

        // ทำการอัปเดตข้อมูลในฐานข้อมูล
        const updatedPersonnel = await prisma.agencyPersonnel.update({
            where: { id },
            data: {
                nameTitle,
                firstName,
                lastName,
                position,
                positionName,
                department,
                image: updatedImageUrl,
            },
        });

        return NextResponse.json({ success: true, personnel: updatedPersonnel }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to update agency personnel", message: (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
