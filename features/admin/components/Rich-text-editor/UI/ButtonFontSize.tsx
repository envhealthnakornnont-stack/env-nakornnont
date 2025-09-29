import { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { ChevronDown } from 'lucide-react'

const ButtonFontSize = ({ editor }: { editor: Editor }) => {
    const [label, setLabel] = useState('16px')
    const sizes = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '36px', '48px', '72px']

    useEffect(() => {
        if (!editor) return

        const updateLabel = () => {
            const size = editor.getAttributes('textStyle').fontSize   // inline font-size
            if (size) {
                setLabel(size)
                return
            }

            // 2. ถ้าเป็น heading ให้แมปตามระดับ
            if (editor.isActive('heading')) {
                const level = editor.getAttributes('heading').level
                let defaultSize: string
                if (level === 1) defaultSize = '24px'
                else if (level === 2) defaultSize = '20px'
                else defaultSize = '18px'
                setLabel(defaultSize)
                return
            }

            setLabel('16px')                                      // ดีฟอลต์กรณีเป็น <p>
        }

        editor.on('selectionUpdate', updateLabel)
        editor.on('transaction', updateLabel)
        updateLabel()

        return () => {
            editor.off('selectionUpdate', updateLabel)
            editor.off('transaction', updateLabel)
        }
    }, [editor])

    return (
        <div className="dropdown min-w-0 shrink-0">
            <div className="tooltip tooltip-bottom" data-tip="ขนาดฟอนต์">
                <div tabIndex={0} role="button" className="btn btn-sm">
                    {label}
                    <ChevronDown size={12} />
                </div>
            </div>
            <div
                tabIndex={0}
                className="dropdown-content flex justify-center flex-row  gap-1 menu bg-base-100 rounded-box z-[1] w-20 h-48 md:h-auto overflow-scroll md:overflow-visible p-2 shadow"
            >
                {sizes.map(size => (
                    <button key={size}
                        type='button'
                        className={`btn btn-sm ${label === size ? 'btn-primary' : ''}`}
                        onClick={() =>
                            editor
                                ?.chain()
                                .focus()
                                .setMark('textStyle', { fontSize: size })
                                .run()
                        }
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ButtonFontSize