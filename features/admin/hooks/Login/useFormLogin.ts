import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginErrors {
    email: string;
    password: string;
    general: string;
}

const useFormLogin = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [errors, setErrors] = useState<LoginErrors>({ email: "", password: "", general: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        let isValid = true;
        const newErrors = { email: "", password: "", general: "" };

        // Validate Email
        if (!formData.email) {
            newErrors.email = "กรุณาระบุอีเมล";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "รูปแบบอีเมล์ไม่ถูกต้อง";
            isValid = false;
        }

        // Validate Password
        if (!formData.password) {
            newErrors.password = "กรุณาระบุพาสเวิร์ด";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
            isValid = false;
        } else if (
            !/(?=.*[A-Z])/.test(formData.password) ||
            !/(?=.*[a-z])/.test(formData.password) ||
            !/(?=.*\d)/.test(formData.password) ||
            !/(?=.*[@$!%*?&#%+])/
                .test(formData.password)
        ) {
            newErrors.password =
                "รหัสผ่านต้องประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setErrors(e => ({ ...e, [name]: "" as any, general: "" }));
        setFormData(f => ({ ...f, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl: "/admin/dashboard",
            });
            if (result?.error) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    general: "การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง",
                }));
            } else if (result?.url) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    general: "เข้าสู่ระบบสำเร็จ",
                }));
                router.push("/admin/dashboard");
            }

        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                general: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง",
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        setErrors,
        isSubmitting,
        handleChange,
        handleSubmit,
    };
};

export default useFormLogin;
