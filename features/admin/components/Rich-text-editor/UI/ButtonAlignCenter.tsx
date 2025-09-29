import { Editor } from '@tiptap/react'
import { AlignCenter } from 'lucide-react'

const ButtonAlignCenter = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="จัดกึ่งกลาง Ctrl+Shift+E">
            <button
                type='button'
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <AlignCenter size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonAlignCenter