"use client";
import { useEffect } from "react";

export type AlertVariant = "success" | "error";

export interface AlertProps {
    message: string;
    variant?: AlertVariant;           // ชนิดของ alert
    duration?: number;                // (ms) ให้อัตโนมัติซ่อนหลังจากกี่มิลลิวินาที
    onClose?: () => void;             // callback เมื่อปิด
}

const variantStyles: Record<AlertVariant, string> = {
    success: "alert-success",
    error: "alert-error",
};

const Alert = ({ message, variant = "success", duration, onClose, }: AlertProps) => {

    useEffect(() => {
        if (!duration) return;
        const timer = setTimeout(() => {
            onClose?.();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            role="alert"
            className={`fixed bottom-4 right-4 w-80 shadow-lg alert ${variantStyles[variant]} z-[60] justify-start`}
        >
            <span>{message}</span>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-sm btn-ghost btn-circle absolute top-2 right-2"
                    aria-label="Close alert"
                >
                    ✕
                </button>
            )}
        </div>
    )
}

export default Alert