"use client";

import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    details: string;
}

interface FormErrors {
    fullName?: string;
    address?: string;
    phone?: string;
    email?: string;
    details?: string;
}

interface AlertConfig {
    message: string;
    type: "success" | "error"; // ระบุประเภทของ alert
}

export const FormContact = () => {

    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        address: "",
        phone: "",
        email: "",
        details: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = "กรุณากรอกชื่อ - นามสกุล";
        }
        if (!formData.address.trim()) {
            newErrors.address = "กรุณากรอกที่อยู่ที่ติดต่อได้";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
        } else if (!/^0\d{8,9}$/.test(formData.phone)) {
            newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง (รองรับรูปแบบ 9 หรือ 10 หลัก)";
        }
        if (!formData.email.trim()) {
            newErrors.email = "กรุณากรอกอีเมล";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
        }
        if (!formData.details.trim()) {
            newErrors.details = "กรุณากรอกรายละเอียด";
        }
        return newErrors;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showAlert("กรุณากรอกข้อมูลให้ครบถ้วน!", "error");
        } else {
            setErrors({});
            console.log("Preparing to send data:", formData);

            // ส่งข้อมูลไปยัง backend หรือทำงานเพิ่มเติม
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                if (!apiUrl) {
                    throw new Error("API URL is not defined in the environment variables");
                }

                const response = await axios.post(`${apiUrl}/api/contact/`, formData);

                if (response.status === 200) {
                    console.log("Response from API:", response.data);
                    showAlert("ส่งข้อมูลสำเร็จ!", "success");
                    setFormData({
                        fullName: "",
                        address: "",
                        phone: "",
                        email: "",
                        details: "",
                    });
                } else {
                    console.error("Failed to send data. Status:", response.status);
                    showAlert("การส่งข้อมูลล้มเหลว", "error");
                }

            } catch (error) {
                console.error("An error occurred:", error);
                showAlert("เกิดข้อผิดพลาดในการส่งข้อมูล", "error");
            }
        }
    };

    const showAlert = (message: string, type: "success" | "error") => {
        setAlertConfig({ message, type });
        setTimeout(() => {
            setAlertConfig(null); // ซ่อน alert หลังจาก 3 วินาที
        }, 3000);
    };


    return (
        <div className="max-w-2xl w-full self-center">
            <h1 className="text-xl sm:text-2xl text-center font-bold mb-4">ติดต่อผ่านอีเมล</h1>
            {alertConfig && (
                <div role="alert" className={`fixed bottom-4 right-4 shadow-lg w-80 alert alert-error
                    }`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        {alertConfig.type === "success" ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                    </svg>
                    <span>{alertConfig.message}</span>
                </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">ชื่อ - นามสกุล</span>
                        </div>
                        <input type="text" name="fullName" placeholder="ชื่อ - นามสกุล" className={`input input-bordered w-full ${errors.fullName && 'input-error'}`} value={formData.fullName} onChange={handleChange} />
                        {errors.fullName && (
                            <div className="label">
                                <span className="label-text-alt text-error">{errors.fullName}</span>
                            </div>
                        )}
                    </label>
                </div>
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">ที่อยู่ที่ติดต่อได้</span>
                        </div>
                        <input type="text" name="address" placeholder="ที่อยู่ที่ติดต่อได้" className={`input input-bordered w-full ${errors.address && 'input-error'}`} value={formData.address} onChange={handleChange} />
                        {errors.address && (
                            <div className="label">
                                <span className="label-text-alt text-error">{errors.address}</span>
                            </div>
                        )}
                    </label>
                </div>
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">เบอร์โทรศัพท์</span>
                        </div>
                        <input type="text" name="phone" placeholder="08xxxxxxxx" className={`input input-bordered w-full ${errors.phone && 'input-error'}`} value={formData.phone} onChange={handleChange} />
                        {errors.phone && (
                            <div className="label">
                                <span className="label-text-alt text-error">{errors.phone}</span>
                            </div>
                        )}
                    </label>
                </div>
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">อีเมล</span>
                        </div>
                        <input type="text" name="email" placeholder="example@gmail.com" className={`input input-bordered w-full ${errors.email && 'input-error'}`} value={formData.email} onChange={handleChange} />
                        {errors.email && (
                            <div className="label">
                                <span className="label-text-alt text-error">{errors.email}</span>
                            </div>
                        )}
                    </label>
                </div>
                <div>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">เรื่องร้องเรียน</span>
                        </div>
                        <select className="select select-bordered">
                            <option disabled selected>แจ้งเก็บขยะ</option>
                            <option>แจ้งขอถังขยะ</option>
                            <option>แจ้งเก็บกิ่งไม้ ใบไม้</option>
                            <option>แจ้งเก็บโฟม</option>
                            <option>แจ้งเก็บซากอิเล็กทรอนิกส์</option>
                            <option>แจ้งเก็บเศษวัสดุ ตู้ เตียง ที่นอน</option>
                        </select>
                        <div className="label">
                            <span className="label-text-alt">Alt label</span>
                        </div>
                    </label>
                </div>
                <div>
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">รายละเอียด</span>
                        </div>
                        <textarea className={`textarea textarea-bordered h-24 ${errors.details && 'textarea-error'}`} placeholder="รายละเอียด" name="details" value={formData.details} onChange={handleChange}></textarea>
                        {errors.details && (
                            <div className="label">
                                <span className="label-text-alt text-error">{errors.details}</span>
                            </div>
                        )}
                    </label>
                </div>
                <button className="btn btn-primary">ส่งข้อมูล</button>
            </form>
        </div>
    )
}
