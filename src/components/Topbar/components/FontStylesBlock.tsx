import { useCallback, useMemo } from 'react';

import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import BackgroundColor from '../../../icons/topbar-font-color/backgroundColor.svg';
import Color from '../../../icons/topbar-font-color/color.svg';
import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import { StylePropsConst } from '../../../utils/styleUtils';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import ColorPicker from '../../controls/ColorPicker';

const FontStylesBlock = () => {
    const { style, actualStyleRef, updateActualStyle } = useTooltip();
    const { editor } = useEditor();

    const handleUpdateColor = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.COLOR]: value };
            updateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [actualStyleRef, editor, updateActualStyle]
    );

    // const setIsOpenRef = useRef(setIsOpenLink);

    // useEffect(() => {
    //     editor.setHandleOpenLinkEditor(setIsOpenRef.currepn)
    // }, [editor])

    const handleUpdateBackground = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.BACKGROUND_COLOR]: value };
            updateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },

        [actualStyleRef, editor, updateActualStyle]
    );

    const handleUpdateFontWeight = useCallback(() => {
        const value = style.fontWeight === '400' ? '700' : '400';
        const newStyleProp = { [StylePropsConst.FONT_WEIGHT]: value };
        updateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
    }, [actualStyleRef, editor, style.fontWeight, updateActualStyle]);

    const handleUpdateFontStyle = useCallback(() => {
        const value = style.fontStyle === 'normal' ? 'italic' : 'normal';
        const newStyleProp = { [StylePropsConst.FONT_STYLE]: value };
        updateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
    }, [actualStyleRef, editor, style.fontStyle, updateActualStyle]);

    const handleUpdateTextDecoration = useCallback(() => {
        const value = style.textDecoration === 'normal' ? 'underline' : 'normal';

        const newStyleProp = { [StylePropsConst.TEXT_DECORATION]: value };
        updateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
    }, [actualStyleRef, editor, style.textDecoration, updateActualStyle]);

    // const handleEditLink = useCallback(
    //     (action: ActionWithTag, key: NodeKey, href?: string) => {
    //         editor.triggerEditLinkTag(action, key, href);
    //     },
    //     [editor]
    // );

    const colorBg = useMemo(() => style[StylePropsConst.BACKGROUND_COLOR], [style]);
    const color = useMemo(() => style[StylePropsConst.COLOR], [style]);

    return (
        <ButtonsContainer>
            <Button
                Icon={Bold}
                theme="icon"
                onClick={handleUpdateFontWeight}
                isActive={Number(style[StylePropsConst.FONT_WEIGHT]) === 700}
            />
            <Button
                Icon={Italic}
                theme="icon"
                onClick={handleUpdateFontStyle}
                isActive={style[StylePropsConst.FONT_STYLE] === 'italic'}
            />
            <Button
                Icon={Underline}
                theme="icon"
                onClick={handleUpdateTextDecoration}
                isActive={style[StylePropsConst.TEXT_DECORATION] === 'underline'}
            />
            <Button Icon={CodeBlock} theme="icon" />
            {/* <Button Icon={Link} theme="icon" onClick={() => setIsOpenLink(prev => !prev)} />
            {isOpenLink && (
                <LinkEditor
                    onClose={() => setIsOpenLink(false)}
                    activeNode={editor.getfocuseNode() as HTMLElement}
                    value={editor.getfocuseNode()?.nodeName === TAGS.LINK ? editor.getfocuseNode()?.textContent || '' : ''}
                    onChange={handleEditLink}
                />
            )} */}
            <ColorPicker Icon={Color} color={color} handleUpdate={handleUpdateColor} />
            <ColorPicker Icon={BackgroundColor} color={colorBg} handleUpdate={handleUpdateBackground} />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
