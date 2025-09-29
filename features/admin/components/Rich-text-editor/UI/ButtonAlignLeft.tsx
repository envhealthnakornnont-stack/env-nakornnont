import { Editor } from '@tiptap/react'
import { AlignLeft } from 'lucide-react'

const ButtonAlignLeft = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="จัดชิดซ้าย Ctrl+Shift+L">
            <button
                type='button'
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <AlignLeft size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonAlignLeft