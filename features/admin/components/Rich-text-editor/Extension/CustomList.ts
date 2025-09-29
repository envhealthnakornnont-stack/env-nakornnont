import { BulletList } from '@tiptap/extension-bullet-list'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { ListItem } from '@tiptap/extension-list-item'
import { mergeAttributes } from '@tiptap/core'

export const CustomBulletList = BulletList.extend({
    renderHTML({ HTMLAttributes, node }) {
        const classes = ['custom-bullet-list']
        if (node.attrs.textAlign === 'center') classes.push('text-center')
        else if (node.attrs.textAlign === 'right') classes.push('text-right')

        return [
            'ul',
            mergeAttributes(HTMLAttributes, { class: classes.join(' ') }),
            0,
        ]
    },
})

export const CustomOrderedList = OrderedList.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            'ol',
            mergeAttributes(HTMLAttributes, { class: 'custom-ordered-list' }),
            0,
        ]
    },
})

export const CustomListItem = ListItem.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            'li',
            mergeAttributes(HTMLAttributes, { class: 'custom-list-item' }),
            ['span', { class: 'custom-list-item-content' }, 0],
        ]
    },
})