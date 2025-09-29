import { useState, useRef, ChangeEvent, useEffect } from "react";

interface Options {
    maxSizeMB?: number;
    onError?: (msg: string) => void;
}

export function useImageUploader({ maxSizeMB = 2, onError }: Options = {}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            onError?.("กรุณาเลือกไฟล์รูปภาพเท่านั้น")
            return
        };
        if (file.size > maxSizeMB * 1024 * 1024) {
            onError?.(`ขนาดไฟล์ต้องไม่เกิน ${maxSizeMB} MB`)
            return
        };

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImageFile(null);
        setPreviewUrl("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const editImage = () => {
        fileInputRef.current?.click();
    };

    // cleanup blob URL on unmount/preview change
    useEffect(() => {
        return () => {
            if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return { fileInputRef, imageFile, previewUrl, onFileChange, clearImage, editImage };
}