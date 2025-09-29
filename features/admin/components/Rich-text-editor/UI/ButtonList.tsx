import { Editor } from '@tiptap/react'
import { ChevronDown, List, ListOrdered, ListTodo } from 'lucide-react'

const ButtonList = ({ editor }: { editor: Editor }) => {
    return (
        <div className="dropdown min-w-0 shrink-0">
            <div className="tooltip tooltip-bottom" data-tip="รายการ">
                <div tabIndex={0} role="button" className={`${editor.isActive("bulletList") || editor.isActive("orderedList") || editor.isActive("taskList") ? "btn btn-sm btn-primary" : "btn btn-sm"}`}>
                    {
                        editor.isActive("bulletList") ? <List size={20} /> :
                            editor.isActive("orderedList") ? <ListOrdered size={20} /> :
                                editor.isActive("taskList") ? <ListTodo size={20} /> : <List size={20} />
                    }
                    <ChevronDown size={12} />
                </div>
            </div>
            <div tabIndex={0} className="dropdown-content flex flex-col gap-1 menu bg-base-100 rounded-box z-[1] w-16 p-2 shadow">
                <div className="tooltip tooltip-bottom" data-tip="BulletList Ctrl+Shift+8">
                    <button
                        type='button'
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}
                    >
                        <List size={16} />
                    </button>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="OrderedList Ctrl+Shift+7">
                    <button
                        type='button'
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}
                    >
                        <span className="flex gap-1 items-center text-sm font-normal">
                            <ListOrdered size={16} />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ButtonList