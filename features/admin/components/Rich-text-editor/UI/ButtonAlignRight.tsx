import { Editor } from '@tiptap/react'
import { AlignRight } from 'lucide-react'

const ButtonAlignRight = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="จัดชิดขวา Ctrl+Shift+R">
            <button
                type='button'
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <AlignRight size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonAlignRight