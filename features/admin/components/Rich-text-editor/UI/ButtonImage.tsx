import { Editor } from '@tiptap/react'
import { ImagePlus } from 'lucide-react'
import { useRef } from 'react';


const ButtonImage = ({ editor }: { editor: Editor }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const src = reader.result as string;
            const img = new window.Image();
            img.onload = () => {
                editor.chain().focus()
                    .setResizableImage({
                        src,
                        alt: file.name,
                        title: file.name,
                        width: 300,
                        height: 300,
                        'data-keep-ratio': true,
                    })
                    .run();
            };
            img.src = src;
        };
        reader.readAsDataURL(file);
        editor.chain().focus().setTextAlign('left').run()
    };
    
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="เพิ่มรูปภาพ">
            <label className="btn btn-sm">
                <ImagePlus size={20} />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={onImageChange}
                    className="hidden"
                />
            </label>
        </div>
    )
}

export default ButtonImage