import { Editor } from '@tiptap/react'
import { Subscript } from 'lucide-react'

const ButtonSubscript = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="ยกตัวอักษรลง Ctrl+,">
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleSubscript().run()}
                className={editor.isActive('subscript') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <Subscript size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonSubscript