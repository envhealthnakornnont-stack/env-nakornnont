"use client";
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Color } from "@tiptap/extension-color"
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import UnderLine from '@tiptap/extension-underline'
import { ResizableImage } from "tiptap-extension-resizable-image";
import SuperScript from '@tiptap/extension-superscript'
import SubScript from '@tiptap/extension-subscript'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { YoutubeExtension } from "./Extension/Youtube";
import { CustomBulletList, CustomListItem, CustomOrderedList } from './Extension/CustomList'
import { Indent, ClearIndentOnEnter } from './Extension/indent'
import { CustomTextStyle } from './Extension/CustomTextStyle'
import MenuBar from "./UI/MenuBar";

interface TiptapProps {
    content: string;
    onChange: (e: string) => void;
    errors?: string
}

const Tiptap = ({ content, onChange, errors }: TiptapProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                listItem: false,
                orderedList: false,
                codeBlock: {
                    HTMLAttributes: {
                        class: 'bg-neutral border input-bordered p-4 rounded-md overflow-x-auto text-sm text-neutral-content',
                    }
                },
                code: {
                    HTMLAttributes: {
                        class: 'bg-base-200 border input-bordered p-1 rounded-md text-sm',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-base-content pl-4 italic text-base-content/50',
                    },
                },
            }),
            CustomBulletList,
            CustomOrderedList,
            CustomListItem,
            ResizableImage.configure({
                defaultWidth: 500,
                defaultHeight: 500,
            }),
            Indent.configure({
                types: ['paragraph', 'heading', 'listItem', 'bulletList', 'orderedList', "taskList"],
                minLevel: 0,
                maxLevel: 16,
            }),
            ClearIndentOnEnter,
            CustomTextStyle,
            SuperScript.configure({
                HTMLAttributes: {
                    class: 'text-sm align-super',
                },
            }),
            SubScript.configure({
                HTMLAttributes: {
                    class: 'text-sm align-sub',
                },
            }),
            Link.configure({
                HTMLAttributes: {
                    class: 'text-primary underline decoration-primary decoration-2 underline-offset-4 cursor-pointer'
                },
                openOnClick: false,
            }),
            Color.configure({ types: ["textStyle"] }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'youtube', 'bulletList', 'listItem', "taskItem", "taskList"],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            UnderLine.configure(
                {
                    HTMLAttributes: {
                        class: 'underline decoration-base-content decoration-2 underline-offset-4',
                    },
                }
            ),
            YoutubeExtension,
            Placeholder.configure({ placeholder: 'ข้อความกิจกรรม, รูปภาพ, วิดีโอ'})
        ],
        editorProps: {
            attributes: {
                class: `ProseMirror p-6 min-h-24 border ${errors ? "border-error" : "input-bordered"} rounded-lg focus:ring-primary focus:ring-offset-base-100 focus:ring focus:ring-offset-2 focus:outline-none`,
            },
        },
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        content: content,
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    });

    if (!editor) {
        return null
    }

    return (
        <div className="">
            <MenuBar editor={editor} />
            {/* Editor Content */}
            <EditorContent editor={editor} className="tiptap" />
            {errors && (
                <div className="label">
                    <span className="label-text-alt text-error">{errors}</span>
                </div>
            )}
        </div >
    )
}

export default Tiptap