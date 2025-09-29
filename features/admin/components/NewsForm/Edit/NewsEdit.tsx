"use client";
import axios from "axios";
import Image from "next/image";
import Loading from "@/features/admin/components/Loading";
import InputField from "@/features/admin/components/InputField";
import Tiptap from "@/features/admin/components/Rich-text-editor/Tiptap";
import Alert from "@/features/admin/components/Alert";
import ErrorPage from "@/features/admin/components/NewsForm/Edit/404";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { Pencil, X } from "lucide-react";
import 'tiptap-extension-resizable-image/styles.css';

interface EditContentPageProps {
    type: "activity" | "news";
    apiFetchBase: string;
    apiUpdateBase: string;
    redirectPath: string;
}

const page = ({ type, apiFetchBase, apiUpdateBase, redirectPath }: EditContentPageProps) => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [detail, setDetail] = useState("");
    const [htmlContent, setHtmlContent] = useState("<p></p>");
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fetchError, setFetchError] = useState(false)

    const resolvePreviewSrc = (previewUrl: string): string => {
        if (previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")) {
            return previewUrl; // สำหรับ preview ชั่วคราว
        }
        return `/api/uploads${previewUrl}`;
    };

    // Fetch existing data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${apiFetchBase}/${id}`);
                const data = type === "activity" ? res.data.activity : res.data.news
                setTitle(data.title);
                setDetail(data.description || "");
                setHtmlContent(data.content || "<p></p>");
                if (data.image) {
                    setExistingImageUrl(data.image);
                }
            } catch (error) {
                setFetchError(true)
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchData();
    }, [id, apiFetchBase]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            return setMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        }
        if (file.size > 2 * 1024 * 1024) {
            return setMessage("ขนาดไฟล์ต้องไม่เกิน 2 MB");
        }
        setErrors(prev => ({ ...prev, coverImage: "" }));
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setExistingImageUrl("");
    };

    const handleCancelImage = () => {
        setImageFile(null);
        setPreviewUrl("");
        setExistingImageUrl("");
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!title.trim()) {
            errs.title = type === "activity"
                ? "กรุณากรอกชื่อกิจกรรม"
                : "กรุณากรอกชื่อข่าวประชาสัมพันธ์";
        }
        if (type === "news" && !detail.trim()) {
            errs.detail = "กรุณากรอกรายละเอียดข่าวประชาสัมพันธ์";
        }
        if (htmlContent === "<p></p>" || !htmlContent.trim()) {
            errs.htmlContent = type === "activity"
                ? "กรุณากรอกรายละเอียดกิจกรรม"
                : "กรุณากรอกรายละเอียดข่าวประชาสัมพันธ์";
        }
        if (!imageFile && !existingImageUrl) {
            errs.coverImage = type === "activity" ? "กรุณาอัปโหลดรูปปกกิจกรรม" : "กรุณาอัปโหลดรูปปกข่าวประชาสัมพันธ์";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!validate()) return;
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("title", title);
        if (type === "news") formData.append("detail", detail);
        formData.append("htmlContent", htmlContent);
        formData.append("authorId", String(/* session?.user.id */ ""));
        if (imageFile) formData.append("coverImage", imageFile);

        try {
            await axios.put(`${apiUpdateBase}/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("แก้ไขข้อมูลสำเร็จ!");
            router.push(redirectPath);
        } catch (error) {
            setMessage((error as any)?.response?.data?.error);
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (fetchError) {
        return <ErrorPage type={type}/>
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Image */}
            <div className="flex flex-col space-y-6 bg-base-100 rounded-lg shadow m-3 p-2 sm:m-3 sm:p-3 lg:m-4 lg:p-3 xl:m-5 xl:p-5">
                <div className="relative w-64 h-72 mx-auto cursor-pointer">
                    <div
                        className={`w-64 h-72 relative overflow-hidden rounded-lg ring-offset-base-100 ring ring-offset-2 ${errors.coverImage ? "ring-error" : "ring-primary"}`}
                        onClick={() => document.getElementById("file-input")?.click()}
                    >
                        {(previewUrl || existingImageUrl) ? (
                            <Image
                                src={previewUrl || resolvePreviewSrc(existingImageUrl)}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-base-200">
                                <span className="text-gray-400">รูปแนวตั้ง</span>
                            </div>
                        )}
                    </div>
                    {(previewUrl || existingImageUrl) ? (
                        <button
                            type="button"
                            onClick={handleCancelImage}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 border border-white tooltip"
                            data-tip="ยกเลิกการเปลี่ยนรูป"
                        >
                            <X size={16} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => document.getElementById("file-input")?.click()}
                            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 border border-white tooltip"
                            data-tip="แก้ไขรูป"
                        >
                            <Pencil size={16} />
                        </button>
                    )}
                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
                {errors.coverImage && <p className="text-sm text-error text-center">{errors.coverImage}</p>}
                {/* Title */}
                <InputField
                    label={type === "activity" ? "ชื่อกิจกรรม" : "ชื่อข่าวประชาสัมพันธ์"}
                    name="title"
                    placeholder={type === "activity" ? "ชื่อกิจกรรม" : "ชื่อข่าวประชาสัมพันธ์"}
                    value={title}
                    error={errors.title}
                    onChange={e => setTitle(e.target.value)}
                />
                {/* Detail for news */}
                {type === "news" && (
                    <InputField
                        label="รายละเอียดข่าวประชาสัมพันธ์"
                        placeholder="รายละเอียดข่าวประชาสัมพันธ์"
                        name="detail"
                        value={detail}
                        error={errors.detail}
                        onChange={e => setDetail(e.target.value)}
                    />
                )}
                {/* Rich Text Editor */}
                <Tiptap content={htmlContent} onChange={setHtmlContent} errors={errors.htmlContent} />
                {/* Actions */}
                <div className="flex justify-end gap-4">
                    <button type="submit" className="btn btn-primary">
                        {isSubmitting ? "กำลังบันทึก..." : "ยืนยัน"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-neutral"
                        onClick={() => router.push(redirectPath)}
                    >
                        ยกเลิก
                    </button>
                </div>
            </div>

            {/* Alert */}
            {message && (
                <Alert
                    message={message}
                    variant={message.includes("แก้ไขข้อมูลสำเร็จ") ? "success" : "error"}
                    duration={5000}
                    onClose={() => setMessage(null)}
                />
            )}
        </form>
    )
}

export default page