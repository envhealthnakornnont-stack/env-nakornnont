import { Editor } from '@tiptap/react'
import { CornerDownLeft, Trash, Link2 } from 'lucide-react'
import { useState } from 'react';

const ButtonLinkImage = ({ editor }: { editor: Editor }) => {
    const [urlImg, setUrlImg] = useState("");
    return (
        <div className="dropdown min-w-0 shrink-0">
            <div className="tooltip tooltip-bottom" data-tip="ลิงค์รูปภาพ">
                <div tabIndex={0} role="button" className={`btn btn-sm`}><Link2 size={20} /></div>
            </div>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 md:w-64 p-2 shadow">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <input type="text" placeholder="วางลิงค์" className="input input-sm w-32" value={urlImg} onChange={(e) => setUrlImg(e.target.value)} />
                    <div className='flex'>
                        <div className="tooltip tooltip-bottom" data-tip="เพิ่มลิงค์รูปภาพ">
                            <button
                                type='button'
                                className="btn btn-sm btn-ghost"
                                onClick={() => {
                                    if (urlImg) {
                                        const img = new window.Image();
                                        img.onload = () => {
                                            editor.chain().focus()
                                                .setResizableImage({
                                                    src: urlImg,
                                                    alt: '',
                                                    title: '',
                                                    width: img.width,
                                                    height: img.height,
                                                    'data-keep-ratio': true,
                                                })
                                                .run();
                                        };
                                        img.src = urlImg;
                                        editor.chain().focus().setTextAlign('left').run()
                                    }
                                }}
                            ><CornerDownLeft size={20} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="ลบลิงค์รูปภาพ">
                            <button type='button' className="btn btn-sm btn-ghost" onClick={() => setUrlImg("")}>
                                <Trash size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ButtonLinkImage