import { Editor } from '@tiptap/react'
import { CornerDownLeft, Trash, LinkIcon } from 'lucide-react'
import { useState } from 'react';

const ButtonLink = ({ editor }: { editor: Editor }) => {
    const [urlLink, setUrlLink] = useState("");
    return (
        <div className="dropdown min-w-0 shrink-0">
            <div className="tooltip tooltip-bottom" data-tip="ลิงค์">
                <div tabIndex={0} role="button" className={editor.isActive('link') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}><LinkIcon size={20} /></div>
            </div>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 md:w-64 p-2 shadow">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <input type="text" placeholder="วางลิงค์" className="input input-sm w-32" value={urlLink} onChange={(e) => setUrlLink(e.target.value)} />
                    <div className='flex'>
                        <div className="tooltip tooltip-bottom" data-tip="เพิ่มลิงค์">
                            <button
                                type='button'
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    if (urlLink) {
                                        editor.chain().focus().setLink({ href: urlLink }).run();
                                    }
                                }}
                            >
                                <CornerDownLeft size={20} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="ลบลิงค์">
                            <button
                                type='button'
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    if (urlLink) {
                                        editor.chain().focus().unsetLink().run();
                                    }
                                    setUrlLink("")
                                }}
                            >
                                <Trash />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ButtonLink