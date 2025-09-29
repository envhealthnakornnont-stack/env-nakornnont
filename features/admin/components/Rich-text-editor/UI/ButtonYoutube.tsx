import { Editor } from '@tiptap/react'
import { CornerDownLeft, Trash, Youtube } from 'lucide-react'
import { useState } from 'react';

const ButtonYoutube = ({ editor }: { editor: Editor }) => {
    const [urlYoutube, setUrlYoutube] = useState("");
    const addYoutubeVideo = (urlYoutube: string) => {
        if (!urlYoutube) return;
        const urlObj = new URL(urlYoutube);
        const id = urlObj.searchParams.get('v')
            || urlYoutube.split('/').pop();
        const embedSrc = `https://www.youtube.com/embed/${id}`;
        if (embedSrc) {
            editor.chain()
                .focus()
                .insertContent({
                    type: 'youtube',
                    attrs: {
                        src: embedSrc,
                        width: 560,
                        height: 315,
                    },
                })
                .run()
        }
    }
    return (
        <div className="dropdown min-w-0 shrink-0">
            <div className="tooltip tooltip-bottom" data-tip="ลิงค์ Youtube">
                <div tabIndex={0} role="button" className={`${editor.isActive('youtube') ? 'btn btn-sm btn-primary' : 'btn btn-sm'}`}><Youtube size={20} /></div>
            </div>
            <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-36 md:w-64 p-2 shadow">
                <div className="flex flex-col md:flex-row items-center gap-2">
                    <input type="text" placeholder="วางลิงค์" className="input input-sm w-32" value={urlYoutube} onChange={(e) => setUrlYoutube(e.target.value)} />
                    <div className='flex'>
                        <div className="tooltip tooltip-bottom" data-tip="เพิ่มลิงค์Youtube">
                            <button
                                type='button'
                                className="btn btn-sm btn-ghost"
                                onClick={() => addYoutubeVideo(urlYoutube)}
                            ><CornerDownLeft size={20} />
                            </button>
                        </div>
                        <div className="tooltip tooltip-bottom" data-tip="ลบลิงค์Youtube">
                            <button type='button' className="btn btn-sm btn-ghost" onClick={() => setUrlYoutube("")}>
                                <Trash size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ButtonYoutube