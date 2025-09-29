import TextStyle from '@tiptap/extension-text-style'

export const CustomTextStyle = TextStyle.extend({
    addAttributes() {
        return {
            // นำ attribute เดิมๆ ของ TextStyle มารวม
            ...(this.parent?.() ?? {}),
            // เพิ่ม fontSize attribute
            fontSize: {
                default: null,
                parseHTML: element => {
                    // อ่านจาก style.fontSize เช่น "16px"
                    return element.style.fontSize || null
                },
                renderHTML: attributes => {
                    if (!attributes.fontSize) {
                        return {}
                    }
                    // แปลงเป็น style attribute ใน HTML
                    return { style: `font-size: ${attributes.fontSize}` }
                },
            },

            lineHeight: {
                default: null,
                parseHTML: el => el.style.lineHeight || null,
                renderHTML: attrs => attrs.lineHeight ? { style: `line-height: ${attrs.lineHeight}` } : {},
            },
        }
    },
})