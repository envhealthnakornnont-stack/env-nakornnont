import { Editor } from '@tiptap/react'
import { AlignJustify } from 'lucide-react'

const ButtonAlignJustify = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="จัดข้อความให้เต็มบรรทัด Ctrl+Shift+J">
            <button
                type='button'
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                className={editor.isActive({ textAlign: 'justify' }) ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <AlignJustify size={20} />
            </button>
        </div>
    )
}

export default ButtonAlignJustify