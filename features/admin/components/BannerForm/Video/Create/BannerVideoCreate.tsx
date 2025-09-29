"use client";

import axios from "axios";
import Alert from "@/features/admin/components/Alert";
import InputField from "@/features/admin/components/InputField";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { Info, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateBannerVideoFormData {
    title: string;
    sortOrder: number; // 1 ถึง 6
    isActive: string;
}

interface FormErrors {
    title?: string;
    sortOrder?: string;
    isActive?: string;
    videoMobile?: string;
    videoDesktop?: string;
}

const CreateBannerVideoPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateBannerVideoFormData>({
        title: "",
        sortOrder: 0,
        isActive: "",
    });
    const [availableOrders, setAvailableOrders] = useState<number[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // States สำหรับ file input และ preview URLs สำหรับวิดีโอ Desktop และ Mobile
    const [videoMobileFile, setVideoMobileFile] = useState<File | null>(null);
    const [videoMobileUrl, setVideoMobileUrl] = useState<string>("");
    const [videoDesktopFile, setVideoDesktopFile] = useState<File | null>(null);
    const [videoDesktopUrl, setVideoDesktopUrl] = useState<string>("");

    const mobileInputRef = useRef<HTMLInputElement>(null);
    const desktopInputRef = useRef<HTMLInputElement>(null);

    const mobileVideoRef = useRef<HTMLVideoElement>(null);
    const desktopVideoRef = useRef<HTMLVideoElement>(null);

    const handleMobileClick = () => mobileInputRef.current?.click();
    const handleDesktopClick = () => desktopInputRef.current?.click();

    const handleCancelMobile = () => {
        setVideoMobileFile(null);
        setVideoMobileUrl("");
        setErrors(e => ({ ...e, VideoMobile: undefined }));
        if (mobileInputRef.current) mobileInputRef.current.value = "";
    };

    const handleCancelDesktop = () => {
        setVideoDesktopFile(null);
        setVideoDesktopUrl("");
        setErrors(e => ({ ...e, videoDesktop: undefined }));
        if (desktopInputRef.current) desktopInputRef.current.value = "";
    };

    const handleMobileFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            setErrors(e => ({ ...e, videoMobile: "กรุณาอัปโหลดไฟล์วิดีโอเท่านั้น" }));
            return;
        }
        setErrors(e => ({ ...e, videoMobile: undefined }));
        setVideoMobileFile(file);
        setVideoMobileUrl(URL.createObjectURL(file));
    };

    const handleDesktopFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) {
            setErrors(e => ({ ...e, videoDesktop: "กรุณาอัปโหลดไฟล์วิดีโอเท่านั้น" }));
            return;
        }
        setErrors(e => ({ ...e, videoDesktop: undefined }));
        setVideoDesktopFile(file);
        setVideoDesktopUrl(URL.createObjectURL(file));
    };

    // ดึงข้อมูลแบนเนอร์ทั้งหมดเพื่อคำนวณ available sort orders
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get("/api/banner/video");
                const banners = res.data as { sortOrder: number }[];
                const usedOrders: number[] = banners.map((banner) => banner.sortOrder);
                const allOrders = Array.from({ length: 6 }, (_, i) => i + 1);
                const available = allOrders.filter((order) => !usedOrders.includes(order));
                // ถ้าแก้ไขแบนเนอร์อยู่ (กรณีมีค่า sortOrder ที่มีอยู่) ให้เพิ่มเข้าไปด้วย
                if (formData.sortOrder && !available.includes(formData.sortOrder)) {
                    available.push(formData.sortOrder);
                    available.sort((a, b) => a - b);
                }
                setAvailableOrders(available);
            } catch (error) {
                console.error("Error fetching banner videos:", error);
            }
        };

        fetchBanners();
    }, [formData.sortOrder]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "กรุณาระบุชื่อแบนเนอร์";
        }
        if (!formData.sortOrder || formData.sortOrder <= 0) {
            newErrors.sortOrder = "กรุณาระบุลำดับแบนเนอร์";
        }
        if (!formData.isActive) {
            newErrors.isActive = "กรุณาระบุสถานะแบนเนอร์";
        }
        if (!videoMobileFile) {
            newErrors.videoMobile = "กรุณาอัปโหลดวิดีโอแบนเนอร์ (Mobile)";
        }
        if (!videoDesktopFile) {
            newErrors.videoDesktop = "กรุณาอัปโหลดวิดีโอแบนเนอร์ (Desktop)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "sortOrder" ? Number(value) : value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleCancel = () => {
        router.push("/admin/banner/video");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("title", formData.title);
            formDataUpload.append("sortOrder", formData.sortOrder.toString());
            formDataUpload.append("isActive", formData.isActive);
            if (videoMobileFile) {
                formDataUpload.append("videoDesktop", videoMobileFile);
            }
            if (videoDesktopFile) {
                formDataUpload.append("videoMobile", videoDesktopFile);
            }

            // ส่งข้อมูลไปยัง API สำหรับสร้าง Banner Video
            await axios.post("/api/banner/video/create", formDataUpload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("สร้างแบนเนอร์สำเร็จแล้ว");
            // รีเซ็ตฟอร์ม
            setFormData({ title: "", sortOrder: 1, isActive: "" });
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
                        ขนาดวิดีโอแบนเนอร์ (Desktop) <span className="font-bold underline">16:9</span> | ขนาดวิดีโอแบนเนอร์ (Mobile) <span className="font-bold underline">1:1</span>
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 my-6">
                    {/* Mobile */}
                    <div className="my-6 md:mx-6">
                        <div className="relative self-center">
                            <div className="avatar cursor-pointer" onClick={handleMobileClick}>
                                <div className={`w-40 h-40 md:w-48 md:h-48 2xl:w-56 2xl:h-56 relative overflow-hidden rounded-lg ring-offset-base-100 ring ring-offset-2 ${errors.videoMobile ? "ring-error" : "ring-primary"
                                    }`}>
                                    {videoMobileUrl ? (
                                        <video
                                            ref={mobileVideoRef}
                                            className="w-full h-full object-cover"
                                            controls
                                        >
                                            <source src={videoMobileUrl} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                                            <span className="text-2xl text-neutral-content">Mobile</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!videoMobileUrl ? (
                                <button
                                    type="button"
                                    onClick={handleMobileClick}
                                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="อัปโหลดวิดีโอ Mobile"
                                >
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleCancelMobile}
                                    className="absolute top-1 right-1 bg-error text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="ยกเลิกวิดีโอ Mobile"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="video/*"
                                ref={mobileInputRef}
                                onChange={handleMobileFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.videoMobile && (
                            <p className="text-xs text-error text-center mt-2">{errors.videoMobile}</p>
                        )}
                    </div>
                    {/* Desktop */}
                    <div className="my-6 md:mx-6">
                        <div className="relative self-center">
                            <div className="avatar cursor-pointer" onClick={handleDesktopClick}>
                                <div className={`w-64 h-36 md:w-72 md:h-40 2xl:w-80 2xl:h-48 relative overflow-hidden rounded-lg ring-offset-base-100 ring ring-offset-2 ${errors.videoDesktop ? "ring-error" : "ring-primary"
                                    }`}>
                                    {videoDesktopUrl ? (
                                        <video
                                            ref={desktopVideoRef}
                                            className="w-full h-full object-cover"
                                            controls
                                        >
                                            <source src={videoDesktopUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-base-200">
                                            <span className="text-xl text-neutral-content">Desktop</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!videoDesktopUrl ? (
                                <button
                                    type="button"
                                    onClick={handleDesktopClick}
                                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="อัปโหลดวิดีโอ Desktop"
                                >
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleCancelDesktop}
                                    className="absolute top-1 right-1 bg-error text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="ยกเลิกวิดีโอ Desktop"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="video/*"
                                ref={desktopInputRef}
                                onChange={handleDesktopFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.videoDesktop && (
                            <p className="text-xs text-error text-center mt-2">{errors.videoDesktop}</p>
                        )}
                    </div>
                </div>
                <div className="md:max-w-lg md:w-full md:self-center">
                    <InputField label="ชื่อแบนเนอร์" name="title" placeholder="ตัวอย่าง แบนเนอร์วิดีโอ" value={formData.title} error={errors.title} onChange={handleChange} />
                </div>
                <label className="form-control md:max-w-lg md:w-full md:self-center">
                    <div className="label">
                        <span className="label-text">ลำดับแบนเนอร์</span>
                    </div>
                    <select
                        className={`select select-bordered ${errors.sortOrder ? "select-error" : ""}`}
                        value={formData.sortOrder}
                        onChange={handleChange}
                        name="sortOrder"
                    >
                        <option value="">กรุณาเลือก</option>
                        {availableOrders.map((order) => (
                            <option key={order} value={order}>
                                {order}
                            </option>
                        ))}
                    </select>
                    {errors.sortOrder && (
                        <div className="label">
                            <span className="label-text-alt text-error">{errors.sortOrder}</span>
                        </div>
                    )}
                </label>
                <label className="form-control md:max-w-lg md:w-full md:self-center">
                    <div className="label">
                        <span className="label-text">สถานะแบนเนอร์</span>
                    </div>
                    <select
                        className={`select select-bordered ${errors.isActive ? "select-error" : ""}`}
                        value={formData.isActive}
                        onChange={handleChange}
                        name="isActive"
                    >
                        <option value="" disabled hidden>กรุณาเลือก</option>
                        <option value="1">แสดงแบนเนอร์</option>
                        <option value="0">ไม่แสดงแบนเนอร์</option>
                    </select>
                    {errors.isActive && (
                        <div className="label">
                            <span className="label-text-alt text-error">{errors.isActive}</span>
                        </div>
                    )}
                </label>
                <div className="flex justify-end gap-4 my-6 md:max-w-lg md:w-full md:self-center">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "กำลังดำเนินการ..." : "ยืนยัน"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-neutral"
                        onClick={handleCancel}
                    >
                        ยกเลิก
                    </button>
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
