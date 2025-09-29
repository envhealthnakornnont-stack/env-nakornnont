import { useState } from "react";

const useCopyToClipboard = () => {
    const [showAlert, setShowAlert] = useState(false);

    const showTemporaryAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // ซ่อนหลังจาก 3 วินาที
    };

    const fallbackCopyText = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            showTemporaryAlert();
        } catch (err) {
            console.error("Fallback: Copy failed", err);
        }
        document.body.removeChild(textArea);
    };

    const copyToClipboard = async (text: string) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                showTemporaryAlert();
            } catch (err) {
                console.error("Clipboard copy failed:", err);
                fallbackCopyText(text);
            }
        } else {
            fallbackCopyText(text);
        }
    };

    return { showAlert, copyToClipboard };
};

export default useCopyToClipboard;
