import fs from "fs";
import path from "path";

export function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function saveBufferUnder(
    buffer: Buffer,
    segments: string[],   // ["news", newsFolder, "cover"]
    filename: string
) {
    const absDir = path.join(process.cwd(), "uploads", ...segments);
    ensureDir(absDir);
    const abs = path.join(absDir, filename);
    fs.writeFileSync(abs, buffer);
    return `/uploads/${segments.join("/")}/${filename}`;
}

export function toRealPath(fromApiUrl: string) {
    // เราใช้ prefix /api/uploads/<real>
    const prefix = "/api/uploads/";
    if (!fromApiUrl.startsWith(prefix)) return null;
    const rel = fromApiUrl.slice(prefix.length); // "uploads/...."
    return path.join(process.cwd(), rel);
}

export function rmFileIfExists(absPath: string) {
    if (fs.existsSync(absPath)) {
        try { fs.unlinkSync(absPath); } catch { }
    }
}