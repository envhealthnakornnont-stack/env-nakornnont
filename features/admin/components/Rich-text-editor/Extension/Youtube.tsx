import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { Resizable } from 're-resizable'

export interface YoutubeOptions {
    HTMLAttributes: Record<string, any>,
}

export const YoutubeExtension = Node.create<YoutubeOptions>({
    name: 'youtube',
    group: 'block',
    atom: true,
    draggable: true,

    addOptions() {
        return { HTMLAttributes: {} }
    },

    addAttributes() {
        return {
            src: { default: null },
            width: { default: 560, parseHTML: el => Number(el.style.width?.replace('px', '')) },
            height: { default: 315, parseHTML: el => Number(el.style.height?.replace('px', '')) },
            textAlign: { default: 'left' },
        }
    },

    parseHTML() {
        return [{
            tag: 'div[data-type="youtube"]',
            getAttrs: el => ({ width: parseInt(el.style.width), height: parseInt(el.style.height) })
        }]
    },

    renderHTML({ HTMLAttributes }) {
        const left = HTMLAttributes.textAlign === "left" ? "ml-0 mr-auto" : ""
        const center = HTMLAttributes.textAlign === "center" ? "mx-auto" : ""
        const right = HTMLAttributes.textAlign === "right" ? "ml-auto mr-0" : ""
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, {
                'data-type': 'youtube',
                style: `width: ${HTMLAttributes.width}px; height: ${HTMLAttributes.height}px;`,
                class: [
                    `${left}${center}${right}`,
                    'max-w-[265px]',
                    'max-h-[150px]',                   
                    'sm:max-w-[530px]',
                    `sm:max-h-[298px]`,              
                    'md:max-w-[658px]',
                    `md:max-h-[370px]`,             
                    'lg:max-w-[914px]',
                    `lg:max-h-[514px]`,              
                    'xl:max-w-[1090px]',
                    `xl:max-h-[613px]`,            
                    '2xl:max-w-full',                
                ].join(' '),
            }),
            ['iframe', {
                src: HTMLAttributes.src,
                class: 'w-full h-full',
                frameborder: 0,
                allowfullscreen: 'true',
            }],
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(YoutubeComponent)
    },
})

const YoutubeComponent = ({ node, updateAttributes }: NodeViewProps) => {
    const { src, width, height, textAlign } = node.attrs

    return (
        <NodeViewWrapper style={{ textAlign }}>
            <Resizable
                defaultSize={{ width, height }}
                maxWidth="100%"
                maxHeight="80vh"
                bounds="parent"
                lockAspectRatio
                onResizeStop={(e, dir, ref, delta) => {
                    updateAttributes({
                        width: width + delta.width,
                        height: height + delta.height,
                    })
                }}
                handleComponent={{
                    topLeft: <div className="w-4 h-4 bg-info border-2 border-white rounded-full" />,
                    topRight: <div className="w-4 h-4 bg-info border-2 border-white rounded-full" />,
                    bottomRight: <div className="w-4 h-4 bg-info border-2 border-white rounded-full" />,
                    bottomLeft: <div className="w-4 h-4 bg-info border-2 border-white rounded-full" />,
                }}
                handleStyles={{
                    topLeft: { left: 0, top: 0, transform: 'translate(-50%, -50%)' },
                    topRight: { right: 0, top: 0, transform: 'translate(50%, -50%)' },
                    bottomRight: { right: 0, bottom: 0, transform: 'translate(50%, 50%)' },
                    bottomLeft: { left: 0, bottom: 0, transform: 'translate(-50%, 50%)' },
                }}
                style={{ display: 'inline-block' }}
                className="border-2 border-info box-border"

            >
                <iframe
                    src={src}
                    width="100%"
                    height="100%"
                    className={`${width} ${height}`}
                    allowFullScreen
                />
            </Resizable>
        </NodeViewWrapper>
    )
}
