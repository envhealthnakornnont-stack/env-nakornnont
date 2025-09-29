import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: filePath } = await params;
    const fullPath = path.join(process.cwd(), ...filePath);

    if (!fs.existsSync(fullPath)) {
        return new NextResponse("Not Found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = getContentType(ext);

    return new NextResponse(fileBuffer, {
        headers: {
            "Content-Type": contentType,
        },
    });
}

function getContentType(ext: string): string {
    switch (ext) {
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".gif":
            return "image/gif";
        case ".webp":
            return "image/webp";
        case ".svg":
            return "image/svg+xml";
        case ".mp4":
            return "video/mp4";
        case ".webm":
            return "video/webm";
        default:
            return "application/octet-stream";
    }
}
