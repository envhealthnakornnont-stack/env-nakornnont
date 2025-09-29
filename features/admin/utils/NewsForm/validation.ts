export function validateContentForm(fields: {
    type: "activity" | "news";
    title: string;
    detail?: string;
    htmlContent: string;
    imageFile: File | null;
}) {
    const errs: Record<string, string> = {};
    const { type, title, detail, htmlContent, imageFile } = fields;

    if (!title.trim()) {
        errs.title = type === "activity"
            ? "กรุณากรอกชื่อกิจกรรม"
            : "กรุณากรอกชื่อข่าวประชาสัมพันธ์";
    }
    if (type === "news" && !(detail || "").trim()) {
        errs.detail = "กรุณากรอกรายละเอียดข่าวประชาสัมพันธ์";
    }
    if (htmlContent === "<p></p>" || !htmlContent.trim()) {
        errs.htmlContent = type === "activity"
            ? "กรุณากรอกรายละเอียดกิจกรรม"
            : "กรุณากรอกรายละเอียดข่าวประชาสัมพันธ์";
    }
    if (!imageFile) {
        errs.coverImage = type === "activity" ? "กรุณาอัปโหลดรูปปกกิจกรรม" : "กรุณาอัปโหลดรูปปกข่าวประชาสัมพันธ์";
    }
    return errs;
}
