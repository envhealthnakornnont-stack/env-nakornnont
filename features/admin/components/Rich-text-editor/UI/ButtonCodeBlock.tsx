import { Editor } from '@tiptap/react'
import { CodeSquare } from 'lucide-react'

const ButtonCodeBlock = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="Code Block Ctrl+Alt+C">
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}
            >
                <CodeSquare size={20} />
            </button>
        </div>
    )
}

export default ButtonCodeBlock