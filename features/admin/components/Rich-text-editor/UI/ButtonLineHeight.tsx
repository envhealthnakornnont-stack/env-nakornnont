import { useEffect, useState } from 'react'
import { Editor } from '@tiptap/react'
import { ChevronDown, SeparatorHorizontal } from 'lucide-react'

const ButtonLineHeight = ({ editor }: { editor: Editor }) => {
  const [label, setLabel] = useState('ขนาดตัวอักษร')
  const heights = ['1rem', '1.15rem', '1.5rem', '2rem', '2.5rem', '3rem']

  useEffect(() => {
    if (!editor) return

    const updateLabel = () => {
      // 1. อ่านค่า inline
      const lh = editor.getAttributes('textStyle').lineHeight
      let display = ''

      // 2. ถ้ามี inline ให้ใช้ค่านั้น
      if (lh) {
        display = lh
      }
      // 3. ถ้าเป็น heading แมปตามระดับ
      else if (editor.isActive('heading')) {
        const level = editor.getAttributes('heading').level
        if (level === 1) display = '2.5rem'
        else if (level <= 3) display = '2rem'
        else display = '1.5rem'
      }
      // 4. กรณี paragraph หรืออื่นๆ
      else {
        display = '1.5rem'
      }

      // 5. ตัดคำว่า rem ออก
      setLabel(display.replace(/rem$/, ''))
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
      <div className="tooltip tooltip-bottom" data-tip="ระยะห่างบรรทัด">
        <div tabIndex={0} role="button" className="btn btn-sm">
          <SeparatorHorizontal size={16} />
          <ChevronDown size={12} />
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content flex flex-col gap-1 menu bg-base-100 rounded-box z-[1] w-20 p-2 shadow"
      >
        {heights.map(h => (
          <button key={h}
            type='button'
            className={`btn btn-sm ${label === h.replace(/rem$/, '') ? 'btn-primary' : ''}`}
            onClick={() =>
              editor.chain().focus().setMark('textStyle', { lineHeight: h }).run()
            }
          >
            {h.replace(/rem$/, '')}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ButtonLineHeight