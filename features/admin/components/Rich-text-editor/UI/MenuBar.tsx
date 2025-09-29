import Ruler from "./Ruler";
import ButtonFontSize from "./ButtonFontSize";
import ButtonLineHeight from "./ButtonLineHeight";
import ButtonHeading from "./ButtonHeading";
import ButtonRedo from "./ButtonRedo";
import ButtonUndo from "./ButtonUndo";
import ButtonCodeBlock from "./ButtonCodeBlock";
import ButtonBlockQuote from "./ButtonBlockQuote";
import ButtonBold from "./ButtonBold";
import ButtonItalic from "./ButtonItalic";
import ButtonStrike from "./ButtonStrike";
import ButtonCode from "./ButtonCode";
import ButtonUnderline from "./ButtonUnderline";
import ButtonHighlight from "./ButtonHighlight";
import ButtonImage from "./ButtonImage";
import ButtonFontColor from "./ButtonFontColor";
import ButtonSubscript from "./ButtonSubscript";
import ButtonSuperscript from "./ButtonSuperscript";
import ButtonYoutube from "./ButtonYoutube";
import ButtonLinkImage from "./ButtonLinkImage";
import ButtonLink from "./ButtonLink";
import ButtonList from "./ButtonList";
import ButtonAlignLeft from "./ButtonAlignLeft";
import ButtonAlignCenter from "./ButtonAlignCenter";
import ButtonAlignRight from "./ButtonAlignRight";
import ButtonAlignJustify from "./ButtonAlignJustify";
import { Editor } from '@tiptap/react'

const MenuBar = ({ editor }: { editor: Editor }) => {
    return (
        <div className="sticky top-16 border input-bordered rounded-md p-2 mb-2 bg-base-100 space-x-2 z-50 overflow-hidden md:overflow-visible">
            <div className="flex flex-wrap items-center gap-2">
                <ButtonUndo editor={editor} />
                <ButtonRedo editor={editor} />
                <div className="mx-0 divider divider-horizontal min-w-0 flex-none"></div>
                <ButtonHeading editor={editor} />
                <ButtonFontSize editor={editor} />
                <ButtonLineHeight editor={editor} />
                <ButtonList editor={editor} />
                <ButtonCodeBlock editor={editor} />
                <ButtonBlockQuote editor={editor} />
                <div className="mx-0 divider divider-horizontal min-w-0 flex-none"></div>
                <ButtonFontColor editor={editor} />
                <ButtonBold editor={editor} />
                <ButtonItalic editor={editor} />
                <ButtonStrike editor={editor} />
                <ButtonCode editor={editor} />
                <ButtonUnderline editor={editor} />
                <ButtonHighlight editor={editor} />
                <ButtonLink editor={editor} />
                <ButtonImage editor={editor} />
                <ButtonLinkImage editor={editor} />
                <ButtonYoutube editor={editor} />
                <div className="mx-0 divider divider-horizontal min-w-0 flex-none"></div>
                <ButtonAlignLeft editor={editor} />
                <ButtonAlignCenter editor={editor} />
                <ButtonAlignRight editor={editor} />
                <ButtonAlignJustify editor={editor} />
                <div className="mx-0 divider divider-horizontal min-w-0 shrink-0"></div>
                <ButtonSuperscript editor={editor} />
                <ButtonSubscript editor={editor} />
            </div>
            <Ruler editor={editor} />
        </div>
    )
}

export default MenuBar