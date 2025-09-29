"use client";

import axios from "axios";
import Image from "next/image";
import InputField from "@/features/admin/components/InputField";
import Alert from "@/features/admin/components/Alert";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { Info, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateBannerFormData {
    title: string;
    sortOrder: number; // 1 to 6
    isActive: string;
    imageMobile: string;
    imageDesktop: string;
}

interface FormErrors {
    title?: string;
    sortOrder?: string;
    isActive?: string;
    imageMobile?: string;
    imageDesktop?: string;
}

const page = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateBannerFormData>({
        title: "",
        sortOrder: 0,
        isActive: "",
        imageMobile: "",
        imageDesktop: "",
    });
    const [availableOrders, setAvailableOrders] = useState<number[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [hasActiveBanner, setHasActiveBanner] = useState(false);

    // States for file inputs and preview URLs for desktop and mobile images
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

    // Fetch existing banners to calculate available sort orders
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get("/api/banner/image"); // Adjust endpoint if needed
                const banners = res.data as { sortOrder: number; isActive: boolean }[];
                const usedOrders: number[] = banners.map((banner) => banner.sortOrder);
                const allOrders = Array.from({ length: 6 }, (_, i) => i + 1);
                let available = allOrders.filter((order) => !usedOrders.includes(order));
                if (formData.sortOrder && !available.includes(formData.sortOrder)) {
                    available.push(formData.sortOrder);
                    available.sort((a, b) => a - b);
                }
                setAvailableOrders(available);
                const activeExists = banners.some(b => b.isActive);
                setHasActiveBanner(activeExists);
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, [formData.sortOrder]); // Re-run if the current sortOrder changes (for edit scenarios)

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

        if (!imageMobileFile) {
            newErrors.imageMobile = "กรุณาอัปโหลดรูปแบนเนอร์ (Mobile)";
        }
        if (!imageDesktopFile) {
            newErrors.imageDesktop = "กรุณาอัปโหลดรูปแบนเนอร์ (Desktop)";
        }

        if (
            imageMobileFile &&
            !["image/jpeg", "image/png", "image/gif"].includes(imageMobileFile.type)
        ) {
            newErrors.imageMobile =
                "ไฟล์ต้องเป็นรูปภาพประเภท .jpg, .jpeg, .png, หรือ .gif เท่านั้น";
        }
        if (
            imageDesktopFile &&
            !["image/jpeg", "image/png", "image/gif"].includes(imageDesktopFile.type)
        ) {
            newErrors.imageDesktop =
                "ไฟล์ต้องเป็นรูปภาพประเภท .jpg, .jpeg, .png, หรือ .gif เท่านั้น";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // For sortOrder, convert to number
            [name]: name === "sortOrder" ? Number(value) : value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleCancel = () => {
        router.push("/admin/banner/image");
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
            if (imageMobileFile) {
                formDataUpload.append("coverImageMobile", imageMobileFile);
            }
            if (imageDesktopFile) {
                formDataUpload.append("coverImageDesktop", imageDesktopFile);
            }

            await axios.post("/api/banner/image/create", formDataUpload, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage("สร้างแบนเนอร์สำเร็จแล้ว");
            // Reset form data
            setFormData({
                title: "",
                sortOrder: 1,
                isActive: "",
                imageMobile: "",
                imageDesktop: "",
            });
            setImageMobileFile(null);
            setImageDesktopFile(null);
            setImageMobileUrl("");
            setImageDesktopUrl("");
            router.push("/admin/banner/image");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.error) {
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
            {/* Left Column */}
            <div className="flex flex-col bg-base-100 m-3 p-5 sm:m-3 lg:m-4 xl:m-5 rounded-lg shadow">
                <div role="alert" className="alert alert-info text-sm">
                    <Info size={22} />
                    <p>ขนาดรูปแบนเนอร์ (Desktop) <span className="font-bold underline">1440x720px</span> | ขนาดรูปแบนเนอร์ (Mobile) <span className="font-bold underline">1100x1490px</span></p>
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
                                            alt="Banner Mobile Preview"
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
                                <button
                                    type="button"
                                    onClick={handleMobileClick}
                                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="อัปโหลดรูป Mobile"
                                >
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleCancelMobile}
                                    className="absolute top-1 right-1 bg-error text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="ยกเลิกรูป Mobile"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={mobileInputRef}
                                onChange={handleMobileFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.imageMobile && (
                            <p className="text-xs text-error text-center mt-2">{errors.imageMobile}</p>
                        )}
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
                                            alt="Banner Desktop Preview"
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
                                <button
                                    type="button"
                                    onClick={handleDesktopClick}
                                    className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="อัปโหลดรูป Desktop"
                                >
                                    <Pencil size={16} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleCancelDesktop}
                                    className="absolute top-1 right-1 bg-error text-white rounded-full p-1 border border-white tooltip"
                                    data-tip="ยกเลิกรูป Desktop"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={desktopInputRef}
                                onChange={handleDesktopFileChange}
                                className="hidden"
                            />
                        </div>
                        {errors.imageDesktop && (
                            <p className="text-xs text-error text-center mt-2">{errors.imageDesktop}</p>
                        )}
                    </div>
                </div>
                <div className="md:max-w-lg md:w-full md:self-center">
                    <InputField label="ชื่อแบนเนอร์" name="title" placeholder="ตัวอย่าง แบนเนอร์รูปภาพ" value={formData.title} error={errors.title} onChange={handleChange} />
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
                        {!hasActiveBanner && <option value="1">แสดงแบนเนอร์</option>}
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

export default page;
