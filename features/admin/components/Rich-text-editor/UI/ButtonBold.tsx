import { Editor } from '@tiptap/react'
import { Bold } from 'lucide-react'

const ButtonBold = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="ตัวหนา Ctrl+B">
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}>
                <span className="text-sm">
                    <Bold size={20} />
                </span>
            </button>
        </div>
    )
}

export default ButtonBold