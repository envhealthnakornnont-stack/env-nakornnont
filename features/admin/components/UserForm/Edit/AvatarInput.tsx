"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Pencil, X } from "lucide-react";

interface AvatarInputProps {
    email: string;
    originalAvatar: string;
    onChange: (file: File | null, previewUrl: string) => void;
    onError: (message: string) => void;
}

const AvatarInput: React.FC<AvatarInputProps> = ({ email, originalAvatar, onChange, onError }) => {
    const [previewUrl, setPreviewUrl] = useState<string>(originalAvatar);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resolvePreviewSrc = (previewUrl: string): string => {
        if (previewUrl.startsWith("blob:") || previewUrl.startsWith("data:")) {
            return previewUrl; // สำหรับ preview ชั่วคราว
        }
        return `/api/uploads${previewUrl}`; // เช่น originalAvatar = "/avatar/xxx.png"
    };

    // Cleanup URL.createObjectURL เมื่อ component unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const validateAvatarFile = (file: File): string | null => {
        if (!file.type.startsWith("image/")) {
            return "กรุณาเลือกไฟล์รูปภาพเท่านั้น";
        }
        if (file.size > 500 * 1024) {
            return "ไฟล์ avatar ต้องมีขนาดไม่เกิน 500 KB";
        }
        return null;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const errorMsg = validateAvatarFile(file);
            if (errorMsg) {
                onError(errorMsg);
                onChange(null, originalAvatar);
                return;
            }
            onError("");
            const newPreview = URL.createObjectURL(file);
            setAvatarFile(file);
            setPreviewUrl(newPreview);
            onChange(file, newPreview);
        }
    };

    const handleCancel = () => {
        setAvatarFile(null);
        setPreviewUrl(originalAvatar);
        onChange(null, originalAvatar);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // สร้างตัวอักษร 2 ตัวจากอีเมล เมื่อไม่มีรูป avatar
    const getEmailInitials = (email: string): string => {
        const trimmed = email.trim();
        return trimmed.length >= 2 ? trimmed.slice(0, 2).toUpperCase() : trimmed.toUpperCase();
    };

    return (
        <div className="relative self-center">
            <div className="avatar cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-24 h-24 relative rounded-full overflow-hidden ring-primary ring-offset-base-100 ring ring-offset-2">
                    {previewUrl && previewUrl.trim() !== "" ? (
                        <Image
                            src={resolvePreviewSrc(previewUrl)}
                            alt="Avatar"
                            fill
                            sizes="(max-width: 768px) 100px, 150px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-neutral text-neutral-content">
                            <span className="text-3xl font-bold">{getEmailInitials(email)}</span>
                        </div>
                    )}
                </div>
            </div>
            {!avatarFile ? (
                <button
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border border-white hover:bg-primary-focus focus:outline-none tooltip tooltip-bottom"
                    data-tip="แก้ไขรูป avatar"
                >
                    <Pencil size={16} />
                </button>
            ) : (
                <button
                    onClick={handleCancel}
                    className="absolute top-0 right-0 bg-error text-white rounded-full p-1 border border-white hover:bg-red-600 focus:outline-none tooltip"
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
    );
};

export default AvatarInput;