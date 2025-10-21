"use client";

import axios from "axios";
import Alert from "@/features/admin/components/Alert";
import InputField from "@/features/admin/components/InputField";
import Image from "next/image";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Info, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateCarouselImageFormData {
    title: string;
    href: string;
    badge: string;
    priority: number;
    sortOrder: number;
    isActive: string;
    publishedAt: string;
}

interface FormErrors {
    title?: string;
    href?: string;
    badge?: string;
    priority?: string;
    sortOrder?: string;
    isActive?: string;
    imageMobile?: string;
    imageDesktop?: string;
    publishedAt?: string;
}

const CreateBannerVideoPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateCarouselImageFormData>({
        title: "",
        href: "",
        badge: "",
        priority: 1,
        sortOrder: 0,
        isActive: "",
        publishedAt: "",
    });
    const [availableOrders, setAvailableOrders] = useState<number[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // States สำหรับ file input และ preview URLs สำหรับวิดีโอ Desktop และ Mobile
    const [imageMobileFile, setImageMobileFile] = useState<File | null>(null);
    const [imageMobileUrl, setImageMobileUrl] = useState<string>("");
    const [imageDesktopFile, setImageDesktopFile] = useState<File | null>(null);
    const [imageDesktopUrl, setImageDesktopUrl] = useState<string>("");

    const mobileInputRef = useRef<HTMLInputElement>(null);
    const desktopInputRef = useRef<HTMLInputElement>(null);

    const handleMobileClick = () => mobileInputRef.current?.click();
    const handleDesktopClick = () => desktopInputRef.current?.click();

    const handleCancelMobile = () => {
        setImageMobileFile(null);
        setImageMobileUrl("");
        setErrors(e => ({ ...e, imageMobile: undefined }));
        if (mobileInputRef.current) mobileInputRef.current.value = "";
    };

    const handleCancelDesktop = () => {
        setImageDesktopFile(null);
        setImageDesktopUrl("");
        setErrors(e => ({ ...e, imageDesktop: undefined }));
        if (desktopInputRef.current) desktopInputRef.current.value = "";
    };

    const handleMobileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors(e => ({ ...e, imageMobile: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" }));
            return;
        }
        setErrors(e => ({ ...e, imageMobile: undefined }));
        setImageMobileFile(file);
        setImageMobileUrl(URL.createObjectURL(file));
    };

    const handleDesktopFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors(e => ({ ...e, imageDesktop: "กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น" }));
            return;
        }
        setErrors(e => ({ ...e, imageDesktop: undefined }));
        setImageDesktopFile(file);
        setImageDesktopUrl(URL.createObjectURL(file));
    };

    // ดึงข้อมูลแบนเนอร์ทั้งหมดเพื่อคำนวณ available sort orders
    useEffect(() => {
        const fetchAvailableOrders = async () => {
            try {
                const res = await axios.get("/api/banner/video/orders");
                const used: number[] = res.data.used || [];
                const all = Array.from({ length: 6 }, (_, i) => i + 1);
                const available = all.filter(n => !used.includes(n));

                // เผื่อกรณีมีค่า formData.sortOrder ติดอยู่และไม่อยู่ใน available ก็ใส่กลับ
                if (formData.sortOrder && !available.includes(formData.sortOrder)) {
                    available.push(formData.sortOrder);
                    available.sort((a, b) => a - b);
                }
                setAvailableOrders(available);
            } catch (err) {
                console.error("Error fetching used orders:", err);
                setAvailableOrders([1, 2, 3, 4, 5, 6]); // fallback
            }
        };
        fetchAvailableOrders();
    }, [formData.sortOrder]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) newErrors.title = "กรุณาระบุชื่อแบนเนอร์";
        if (!formData.href.trim()) newErrors.href = "กรุณาระบุลิงก์ปลายทาง";
        if (!formData.sortOrder || formData.sortOrder <= 0) newErrors.sortOrder = "กรุณาระบุลำดับแบนเนอร์";
        if (!formData.isActive) newErrors.isActive = "กรุณาระบุสถานะแบนเนอร์";
        if (!imageMobileFile) newErrors.imageMobile = "กรุณาอัปโหลดรูป (Mobile)";
        if (!imageDesktopFile) newErrors.imageDesktop = "กรุณาอัปโหลดรูป (Desktop)";
        if (formData.priority < 1) newErrors.priority = "priority ควรเป็นเลขบวก (แนะนำ ≥ 1)";
        if (formData.publishedAt && isNaN(Date.parse(formData.publishedAt))) {
            newErrors.publishedAt = "รูปแบบวันที่ไม่ถูกต้อง";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === "priority" || name === "sortOrder"
                    ? Number(value)
                    : value,
        }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCancel = () => router.push("/admin/banner/video");


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const fd = new FormData();
            fd.append("title", formData.title);
            fd.append("href", formData.href);
            fd.append("badge", formData.badge);
            fd.append("priority", String(formData.priority));
            fd.append("sortOrder", String(formData.sortOrder));
            fd.append("isActive", formData.isActive);
            if (formData.publishedAt) fd.append("publishedAt", formData.publishedAt);
            if (imageDesktopFile) fd.append("imageDesktop", imageDesktopFile);
            if (imageMobileFile) fd.append("imageMobile", imageMobileFile);

            await axios.post("/api/banner/video/create", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("สร้างแบนเนอร์สำเร็จแล้ว");
            // รีเซ็ตฟอร์ม
            setFormData({
                title: "",
                href: "",
                badge: "",
                priority: 1,
                sortOrder: 0,
                isActive: "",
                publishedAt: "",
            });
            handleCancelMobile();
            handleCancelDesktop();
            router.push("/admin/banner/video");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-col bg-base-100 m-3 p-5 sm:m-3 lg:m-4 xl:m-5 rounded-lg shadow">
                <div role="alert" className="alert alert-info text-sm">
                    <Info size={22} />
                    <p>
                        แนะนำรูป: Desktop ~ <span className="font-bold underline">1600×900</span> (16:9),
                        Mobile ~ <span className="font-bold underline">960×960</span> (1:1) | ใช้ AVIF/WEBP จะดีที่สุด
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 my-6">
                    {/* Mobile */}
                    <div className="my-6 md:mx-6">
                        <div className="relative self-center">
                            <div className="avatar cursor-pointer" onClick={handleMobileClick}>
                                <div className={`w-40 h-40 md:w-48 md:h-48 2xl:w-56 2xl:h-56 relative overflow-hidden rounded-lg ring-offset-base-100 ring ring-offset-2 ${errors.imageMobile ? "ring-error" : "ring-primary"
                                    }`}>
                                    {imageMobileUrl ? (
                                        <Image
                                            src={imageMobileUrl}
                                            alt="Mobile preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                                            <span className="text-2xl text-neutral-content">Mobile</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!imageMobileUrl ? (
                                <button type="button" onClick={handleMobileClick} className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border border-white tooltip" data-tip="อัปโหลดรูป Mobile">
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <button type="button" onClick={handleCancelMobile} className="absolute top-1 right-1 bg-error text-white rounded-full p-1 border border-white tooltip" data-tip="ยกเลิกรูป Mobile">
                                    <X size={16} />
                                </button>
                            )}
                            <input type="file" accept="image/*" ref={mobileInputRef} onChange={handleMobileFileChange} className="hidden" />
                        </div>
                        {errors.imageMobile && <p className="text-xs text-error text-center mt-2">{errors.imageMobile}</p>}
                    </div>
                    {/* Desktop */}
                    <div className="my-6 md:mx-6">
                        <div className="relative self-center">
                            <div className="avatar cursor-pointer" onClick={handleDesktopClick}>
                                <div className={`w-64 h-36 md:w-72 md:h-40 2xl:w-80 2xl:h-48 relative overflow-hidden rounded-lg ring-offset-base-100 ring ring-offset-2 ${errors.imageDesktop ? "ring-error" : "ring-primary"
                                    }`}>
                                    {imageDesktopUrl ? (
                                        <Image
                                            src={imageDesktopUrl}
                                            alt="Desktop preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                                            <span className="text-xl text-neutral-content">Desktop</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!imageDesktopUrl ? (
                                <button type="button" onClick={handleDesktopClick} className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border border-white tooltip" data-tip="อัปโหลดรูป Desktop">
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <button type="button" onClick={handleCancelDesktop} className="absolute top-1 right-1 bg-error text-white rounded-full p-1 border border-white tooltip" data-tip="ยกเลิกรูป Desktop">
                                    <X size={16} />
                                </button>
                            )}
                            <input type="file" accept="image/*" ref={desktopInputRef} onChange={handleDesktopFileChange} className="hidden" />
                        </div>
                        {errors.imageDesktop && <p className="text-xs text-error text-center mt-2">{errors.imageDesktop}</p>}
                    </div>
                </div>
                <div className="md:max-w-lg md:w-full md:self-center">
                    <InputField label="ชื่อแบนเนอร์" name="title" placeholder="ตัวอย่าง: แจ้งปิดบริการชั่วคราว" value={formData.title} error={errors.title} onChange={handleChange} />
                </div>
                <div className="md:max-w-lg md:w-full md:self-center">
                    <InputField label="ลิงก์ปลายทาง (href)" name="href" placeholder="https://behn.go.th" value={formData.href} error={errors.href} onChange={handleChange} />
                </div>
                <div className="grid md:grid-cols-2 gap-3 md:max-w-lg md:w-full md:self-center">
                    <InputField label="Badge (ไม่บังคับ)" name="badge" placeholder="ประกาศ/ข่าวด่วน/กิจกรรม" value={formData.badge} error={errors.badge} onChange={handleChange} />
                    <InputField label="Priority (เลขมาก=เด่น)" name="priority" type="number" placeholder="1" value={String(formData.priority)} error={errors.priority} onChange={handleChange} />
                </div>
                <label className="form-control md:max-w-lg md:w-full md:self-center">
                    <div className="label"><span className="label-text">ลำดับแบนเนอร์</span></div>
                    <select className={`select select-bordered ${errors.sortOrder ? "select-error" : ""}`} value={formData.sortOrder || ""} onChange={handleChange} name="sortOrder" required>
                        <option value="" disabled>กรุณาเลือก</option>
                        {availableOrders.map((order) => (<option key={order} value={order}>{order}</option>))}
                    </select>
                    {availableOrders.length === 0 && (
                        <div className="label">
                            <span className="label-text-alt text-warning">ลำดับ 1–6 ถูกใช้ครบแล้ว โปรดลบ/แก้ไขรายการเดิมก่อน</span>
                        </div>
                    )}
                    {errors.sortOrder && <div className="label"><span className="label-text-alt text-error">{errors.sortOrder}</span></div>}
                </label>
                <label className="form-control md:max-w-lg md:w-full md:self-center">
                    <div className="label"><span className="label-text">สถานะแบนเนอร์</span></div>
                    <select className={`select select-bordered ${errors.isActive ? "select-error" : ""}`} value={formData.isActive} onChange={handleChange} name="isActive">
                        <option value="" disabled hidden>กรุณาเลือก</option>
                        <option value="1">แสดง</option>
                        <option value="0">ไม่แสดง</option>
                    </select>
                    {errors.isActive && <div className="label"><span className="label-text-alt text-error">{errors.isActive}</span></div>}
                </label>
                <label className="form-control md:max-w-lg md:w-full md:self-center">
                    <div className="label"><span className="label-text">วันที่เผยแพร่ (ไม่บังคับ)</span></div>
                    <input type="date" name="publishedAt" value={formData.publishedAt} onChange={handleChange} className={`input input-bordered ${errors.publishedAt ? "input-error" : ""}`} />
                    {errors.publishedAt && <div className="label"><span className="label-text-alt text-error">{errors.publishedAt}</span></div>}
                </label>
                <div className="flex justify-end gap-4 my-6 md:max-w-lg md:w-full md:self-center">
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "กำลังดำเนินการ..." : "ยืนยัน"}</button>
                    <button type="button" className="btn btn-neutral" onClick={handleCancel}>ยกเลิก</button>
                </div>
            </div>
            {message && (
                <Alert
                    message={message}
                    variant={message === "สร้างแบนเนอร์สำเร็จแล้ว" ? "success" : "error"}
                    duration={5000}
                    onClose={() => setMessage(null)}
                />
            )}
        </form>
    );
};

export default CreateBannerVideoPage;
