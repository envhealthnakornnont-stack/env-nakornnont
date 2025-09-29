import { Editor } from '@tiptap/react'
import { Strikethrough } from 'lucide-react'

const ButtonStrike = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="ขีดทับ Ctrl+Shift+S">
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <Strikethrough size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonStrike