"use client"
import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/react'

type NodeType = 'paragraph' | 'heading' | 'listItem'

const Ruler = ({ editor }: { editor: Editor }) => {
  const [indents, setIndents] = useState<Record<NodeType, number>>({
    paragraph: 0,
    heading: 0,
    listItem: 0,
  })
  const [currentNodeType, setCurrentNodeType] = useState<NodeType>('paragraph')
  const [value, setValue] = useState<number>(0)
  const [dragging, setDragging] = useState(false)

  const onMouseDown = () => setDragging(true)

  // 3. ดัก selection เปลี่ยนเพื่ออัปเดต currentNodeType และ value
  useEffect(() => {
    if (!editor) return
    const { $from } = editor.state.selection

    if (editor.isActive('heading')) {
      setCurrentNodeType('heading')
    } else if (editor.isActive('listItem')) {
      setCurrentNodeType('listItem')
    } else {
      setCurrentNodeType('paragraph')
    }

    setValue(indents[currentNodeType])
  }, [editor?.state.selection, indents, dragging])

  // 4. Handler เมื่อเลื่อน Slider
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndent = Number(e.target.value)
    // อัปเดตใน state map
    setIndents(prev => ({
      ...prev,
      [currentNodeType]: newIndent,
    }))
    // อัปเดตใน editor
    editor
      .chain()
      .focus()
      .updateAttributes(currentNodeType, { indent: newIndent })
      .run()
    setValue(newIndent)
  }

  return (
    <div className='my-8 ps-2 pe-4'>
      <input
        type="range"
        min={0} max={16}
        step={1}
        value={value}
        onMouseDown={onMouseDown}
        onChange={onChange}
        className="range range-sm"
      />
      <div className="flex w-full justify-between text-xs">
        {Array.from({ length: 17 }).map((_, i) => (
          <span key={i}>|</span>
        ))}
      </div>
    </div>
  )
}

export default Ruler