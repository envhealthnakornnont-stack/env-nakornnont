"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CreateUserFormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    department: string;
    role: "USER" | "SUPERUSER";
    avatar: string;
}

interface FormErrors {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    department?: string;
    avatar?: string;
}

const useCreateUserForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateUserFormData>({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        department: "",
        role: "USER",
        avatar: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // เก็บไฟล์ avatar ใน hook
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.firstname.trim()) newErrors.firstname = "กรุณาระบุชื่อ";

        if (!formData.lastname.trim()) newErrors.lastname = "กรุณาระบุนามสกุล";

        if (!formData.email.trim()) newErrors.email = "กรุณาระบุอีเมล";
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";

        if (!formData.password) newErrors.password = "กรุณาระบุพาสเวิร์ด";
        else if (formData.password.length < 6) newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
        else if (
            !/(?=.*[A-Z])/.test(formData.password) ||
            !/(?=.*[a-z])/.test(formData.password) ||
            !/(?=.*\d)/.test(formData.password) ||
            !/(?=.*[@$!%*?&#])/.test(formData.password)
        ) newErrors.password = "รหัสผ่านต้องประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ";

        if (!formData.department.trim()) newErrors.department = "กรุณาระบุแผนกงาน";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "", }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // ตรวจชนิดและขนาดไฟล์
        if (!file.type.startsWith("image/")) {
            setMessage("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
            return;
        }
        if (file.size > 500 * 1024) {
            setMessage("ไฟล์ avatar ต้องมีขนาดไม่เกิน 500 KB");
            return;
        }
        setMessage(null);
        const objectUrl = URL.createObjectURL(file);
        setAvatarFile(file);
        setPreviewUrl(objectUrl);
    };

    function handleCancelAvatar() {
        if (previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setAvatarFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setMessage(null);

        // สร้าง FormData สำหรับ multipart
        const form = new FormData();
        form.append("firstname", formData.firstname);
        form.append("lastname", formData.lastname);
        form.append("email", formData.email.trim().toLowerCase());
        form.append("password", formData.password);
        form.append("department", formData.department);
        form.append("role", formData.role);
        if (avatarFile) form.append("avatar", avatarFile);

        try {
            await axios.post("/api/users/create", form);
            setMessage("สร้างผู้ใช้สำเร็จแล้ว");
            // รีเซ็ตฟอร์ม
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                department: "",
                role: "USER",
                avatar: "",
            });
            setAvatarFile(null);
            router.push("/admin/users");
        } catch (error: any) {
            const errMsg = error?.response?.data?.error || "เกิดข้อผิดพลาด";
            setMessage(errMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => () => {
        if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    return {
        formData,
        errors,
        loading,
        message,
        setMessage,
        avatarFile,
        previewUrl,
        fileInputRef,
        handleChange,
        handleFileChange,
        handleAvatarClick,
        handleCancelAvatar,
        handleSubmit,
    };
};

export default useCreateUserForm;