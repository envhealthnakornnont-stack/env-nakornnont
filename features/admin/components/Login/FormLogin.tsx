"use client";

import useFormLogin from "@/features/admin/hooks/Login/useFormLogin";
import Alert from "@/features/admin/components/Alert";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormLogin = () => {
    const { formData, errors, setErrors, isSubmitting, handleChange, handleSubmit } = useFormLogin();
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center min-h-svh lg:w-[40%] w-full">
            <div className="flex flex-col gap-2 justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                </svg>
                <h1 className="text-3xl font-bold">Sign In</h1>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full px-[10%]">
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">อีเมล</span>
                    </div>
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input type="text" name="email" value={formData.email} onChange={handleChange} className="grow" placeholder="Example@gmail.com" />
                    </label>
                    <div className="label">
                        {errors.email && <div className="label"><span className="label-text-alt text-error">{errors.email}</span></div>}
                    </div>
                </label>
                <label className="form-control w-full">
                    <div className="label">
                        <span className="label-text">รหัสผ่าน</span>
                    </div>
                    <div className="relative">
                        <label className="input input-bordered flex items-center gap-2 pr-10">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="grow"
                                placeholder="รหัสผ่าน"
                            />
                        </label>

                        {/* ปุ่ม toggle ไอคอนตา */}
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="label">
                        {errors.password && (
                            <span className="label-text-alt text-error">{errors.password}</span>
                        )}
                    </div>

                    {errors.general && (
                        <Alert
                            message={errors.general}
                            variant={errors.general === "เข้าสู่ระบบสำเร็จ" ? "success" : "error"}
                            duration={5000}
                            onClose={() =>
                                setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    general: "",
                                }))
                            }
                        />
                    )}
                </label>
                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sign In..." : "Sign In"}</button>
            </form>
        </div>
    )
}

export default FormLogin