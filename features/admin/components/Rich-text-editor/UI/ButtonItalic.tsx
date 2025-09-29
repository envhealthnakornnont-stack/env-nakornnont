import { Editor } from '@tiptap/react'
import { Italic } from 'lucide-react'

const ButtonItalic = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="ตัวเอียง Ctrl+I">
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <Italic size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonItalic