import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

/** ฟิลด์ที่ฟอร์มรองรับ (เพิ่ม remember เพื่อให้สอดกับ UI) */
type LoginField = "email" | "password" | "remember";

/** ค่าฟอร์ม */
export interface LoginFormData {
    email: string;
    password: string;
    remember?: string;
}

/** โครง errors: ใช้ Partial+Record เพื่อ index แบบปลอดภัย และไม่ต้องยัด "" ตั้งต้นทุกตัว */
export type LoginErrors = Partial<Record<LoginField | "general", string>>;

export type SubmitResult = {
    ok: boolean;        // ผลลัพธ์สุดท้ายสำเร็จ/ไม่สำเร็จ
    submitted: boolean; // มีการเรียก signIn ไปจริงไหม (false = ตกที่ validation)
};

const EMAIL_OK = (s: string) => /\S+@\S+\.\S+/.test(s);

const useFormLogin = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormData>({ email: "", password: "" });
    const [errors, setErrors] = useState<LoginErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /** ตรวจสอบฟอร์มแบบไม่ใช้ any */
    const validateForm = (): boolean => {
        let ok = true;
        const next: LoginErrors = {};

        if (!formData.email) {
            next.email = "กรุณาระบุอีเมล";
            ok = false;
        } else if (!EMAIL_OK(formData.email)) {
            next.email = "รูปแบบอีเมลไม่ถูกต้อง";
            ok = false;
        }

        if (!formData.password) {
            next.password = "กรุณาระบุพาสเวิร์ด";
            ok = false;
        } else if (formData.password.length < 6) {
            next.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
            ok = false;
        }

        setErrors(next);
        return ok;
    };

    /** เปลี่ยนค่าฟอร์มแบบ typed */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const field = name as LoginField;

        setErrors((prev) => ({ ...(prev ?? {}), [field]: undefined, general: undefined }));
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    /** ส่งฟอร์มแบบ typed, ไม่มี any */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<SubmitResult> => {
        e.preventDefault();

        if (!validateForm()) {
            return { ok: false, submitted: false }; // ❗ไม่ยิง signIn
        }

        setIsSubmitting(true);
        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl: "/admin/dashboard",
            });

            if (result?.error) {
                setErrors((prev) => ({ ...(prev ?? {}), general: "การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง" }));
                return { ok: false, submitted: true };
            }

            if (result?.url) {
                setErrors((prev) => ({ ...(prev ?? {}), general: "เข้าสู่ระบบสำเร็จ" }));
                router.push("/admin/dashboard");
                return { ok: true, submitted: true };
            }

            setErrors((prev) => ({ ...(prev ?? {}), general: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง" }));
            return { ok: false, submitted: true };
        } catch {
            setErrors((prev) => ({ ...(prev ?? {}), general: "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง" }));
            return { ok: false, submitted: true };
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSubmit = EMAIL_OK(formData.email) && formData.password.length >= 6 && !isSubmitting;

    return { formData, errors, setErrors, isSubmitting, canSubmit, handleChange, handleSubmit };
};

export default useFormLogin;
