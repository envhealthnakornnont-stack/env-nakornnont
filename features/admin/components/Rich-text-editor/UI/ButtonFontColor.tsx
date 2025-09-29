import { Editor } from '@tiptap/react'
import { Baseline } from 'lucide-react'
import { useRef, useState } from 'react';

const ButtonFontColor = ({ editor }: { editor: Editor }) => {
    const [pickedColor, setPickedColor] = useState("#000000");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const applyColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
    };
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="เลือกสีข้อความ">
            <label className="btn btn-sm">
                <Baseline size={20} color={pickedColor} />
                <input
                    type="color"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const c = e.target.value;
                        setPickedColor(c);
                        applyColor(c);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </label>
        </div>
    )
}

export default ButtonFontColor