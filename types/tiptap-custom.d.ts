import '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        customVideo: {
            /**
             * แทรกหรืออัปเดต CustomVideo node
             * @param options.attrs เช่น src, width, height, align
             */
            setCustomVideo: (
                options: {
                    src: string;
                    width?: number;
                    height?: number;
                    align?: 'left' | 'center' | 'right';
                }
            ) => ReturnType;
        };
    }
}