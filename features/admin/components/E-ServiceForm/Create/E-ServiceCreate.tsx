"use client";

import axios from "axios";
import Alert from "@/features/admin/components/Alert";
import Image from "next/image";
import InputField from "@/features/admin/components/InputField";
import { ChangeEvent, useRef, useState, useEffect } from "react";
import { Pencil, X, Info } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateEServiceForm: React.FC = () => {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const [errors, setErrors] = useState<{ image?: string; name?: string; link?: string }>({});
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // เมื่อคลิกที่กรอบหรือปุ่มแก้ไข ให้เปิด file input
    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    // เมื่อเลือกไฟล์แล้ว
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setMessage("ขนาดไฟล์ต้องไม่เกิน 2 MB");
            return;
        }
        setErrors((e) => ({ ...e, image: undefined }));
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // ยกเลิกการเลือกภาพ
    const handleCancelImage = () => {
        setImageFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCancel = () => {
        router.push("/admin/e-service");
    };

    const validateForm = (): boolean => {
        const newErrors: { image?: string; name?: string; link?: string } = {};
        if (!imageFile) newErrors.image = "กรุณาอัปโหลดรูปภาพ";
        if (!name.trim()) newErrors.name = "กรุณาระบุชื่อบริการ";
        if (!link.trim()) newErrors.link = "กรุณาระบุลิงก์บริการ";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ส่งฟอร์ม
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setMessage(null);

        const form = new FormData();
        form.append("coverImage", imageFile!);
        form.append("title", name);
        form.append("linkURL", link);
        try {
            await axios.post("/api/eservice/create", form);
            setMessage("สร้าง E‑Service สำเร็จแล้ว");
            setImageFile(null);
            setPreviewUrl("");
            setName("");
            setLink("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            router.push("/admin/e-service");
        } catch (err: any) {
            setMessage(err?.response?.data?.error || "เกิดข้อผิดพลาดในการสร้าง E‑Service");
        } finally {
            setLoading(false);
        }
    };

    // ทำ clean‑up URL เมื่อ unmount หรือเปลี่ยน previewUrl
    useEffect(() => {
        return () => {
            if (previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div className="m-5 px-8 md:px-16 py-16 bg-base-100 rounded-lg shadow">
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
                <div role="alert" className="alert alert-info text-sm">
                    <Info size={22} />
                    <p>ขนาดรูปแนวตั้ง <span className="font-bold underline">1100x1490px</span></p>
                </div>
                {/* Image section */}
                <div
                    className="relative w-52 h-72 mx-auto cursor-pointer"
                    onClick={handleEditClick}
                >
                    <div className={`w-52 h-72 relative overflow-hidden rounded-lg ring-offset-base-100 ring ring-offset-2 ${errors.image ? "ring-error" : "ring-primary"}`}>
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-base-200">
                                <span className="text-gray-400">รูปแนวตั้ง</span>
                            </div>
                        )}
                    </div>
                    {!previewUrl ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick();
                            }}
                            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 border border-white tooltip"
                            data-tip="แก้ไขรูป"
                        >
                            <Pencil size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelImage();
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 border border-white tooltip"
                            data-tip="ยกเลิกการเปลี่ยนรูป"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                {errors.image && <p className="text-xs text-error text-center">{errors.image}</p>}
                <InputField label="ชื่อบริการ" name="name" placeholder="ชื่อบริการ" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
                <InputField label="ลิงก์บริการ" type="url" name="link" placeholder="http://www.example.com" value={link} error={errors.link} onChange={(e) => setLink(e.target.value)} />

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <button type="submit" className="btn btn-primary">
                        {loading ? "กำลังสร้าง..." : "สร้าง E‑Service"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-neutral"
                        onClick={handleCancel}
                    >
                        ยกเลิก
                    </button>
                </div>
            </form>
            {message && (
                <Alert
                    message={message}
                    variant={message === "สร้าง E‑Service สำเร็จแล้ว" ? "success" : "error"}
                    duration={5000}
                    onClose={() => setMessage(null)}
                />
            )}
        </div>
    );
};

export default CreateEServiceForm;
