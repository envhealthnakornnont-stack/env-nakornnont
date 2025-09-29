'use client'

import { Editor } from '@tiptap/react'
import {
  Heading1, Heading2, Heading3,
  Heading4, Heading5, Heading6,
  Heading, ChevronDown
} from 'lucide-react'
import type { Level } from '@tiptap/extension-heading'

const headingOptions = [
  { level: 1, label: 'Heading 1', Icon: Heading1, tooltip: 'Heading 1 Ctrl+Alt+1' },
  { level: 2, label: 'Heading 2', Icon: Heading2, tooltip: 'Heading 2 Ctrl+Alt+2' },
  { level: 3, label: 'Heading 3', Icon: Heading3, tooltip: 'Heading 3 Ctrl+Alt+3' },
  { level: 4, label: 'Heading 4', Icon: Heading4, tooltip: 'Heading 4 Ctrl+Alt+4' },
  { level: 5, label: 'Heading 5', Icon: Heading5, tooltip: 'Heading 5 Ctrl+Alt+5' },
  { level: 6, label: 'Heading 6', Icon: Heading6, tooltip: 'Heading 6 Ctrl+Alt+6' },
  { level: 0, label: 'Paragraph', Icon: Heading, tooltip: 'Paragraph Ctrl+Alt+0' },
]

type HeadingOption = typeof headingOptions[number]

const HeadingButton = ({
  editor,
  option,
}: { editor: Editor; option: HeadingOption }) => {
  const { level, label, Icon, tooltip } = option
  const isActive = level === 0
    ? editor.isActive('paragraph')
    : editor.isActive('heading', { level })

  const onClick = () => {
    if (level === 0) editor.chain().focus().setParagraph().run()
    else editor.chain().focus().toggleHeading({ level: level as Level }).run()
  }

  return (
    <div className="tooltip tooltip-bottom" data-tip={tooltip}>
      <button
        type='button'
        onClick={onClick}
        className={`btn btn-sm ${isActive ? 'btn-primary' : ''}`}
      >
        <span className="flex gap-1 items-center text-sm font-normal">
          <Icon size={16} /> {label}
        </span>
      </button>
    </div>
  )
}

export default function ButtonHeading({ editor }: { editor: Editor }) {
  return (
    <div className="dropdown min-w-0 shrink-0">
      <div className="tooltip tooltip-bottom" data-tip="หัวเรื่อง">
        <div tabIndex={0} role="button" className={`${editor.isActive("heading") ? "btn btn-sm btn-primary" : "btn btn-sm"}`}>
          <span className="text-base">
            {editor.isActive("heading", { level: 1 }) ? <Heading1 size={20} /> :
              editor.isActive("heading", { level: 2 }) ? <Heading2 size={20} /> :
                editor.isActive("heading", { level: 3 }) ? <Heading3 size={20} /> :
                  editor.isActive("heading", { level: 4 }) ? <Heading4 size={20} /> :
                    editor.isActive("heading", { level: 5 }) ? <Heading5 size={20} /> :
                      editor.isActive("heading", { level: 6 }) ? <Heading6 size={20} /> :
                        <Heading size={15} />
            }
          </span>
          <ChevronDown size={12} />
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content flex flex-col gap-1 menu
                     bg-base-100 rounded-box z-[1] w-32 p-2 shadow"
      >
        {headingOptions.map(option => (
          <HeadingButton
            key={option.level}
            editor={editor}
            option={option}
          />
        ))}
      </div>
    </div>
  )
}
