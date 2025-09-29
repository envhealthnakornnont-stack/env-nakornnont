import { Editor } from '@tiptap/react'
import { TextQuote } from 'lucide-react'

const ButtonBlockQuote = ({ editor }: { editor: Editor }) => {
    return (
        <div className="tooltip tooltip-bottom min-w-0 shrink-0" data-tip="Blockquote Ctrl+Shift+B">
            <button
                type='button'
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}
            >
                <TextQuote size={20} />
            </button>
        </div>
    )
}

export default ButtonBlockQuote