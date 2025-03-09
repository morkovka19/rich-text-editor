/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

import { NodeKey } from '../../../classes/LexicalNode/types';
import { useEditor } from '../../../context/LexicalContext';
import { useTooltip } from '../../../context/ToolbarContext';
import BackgroundColor from '../../../icons/topbar-font-color/backgroundColor.svg';
import Color from '../../../icons/topbar-font-color/color.svg';
import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
import Link from '../../../icons/topbar-font-styles/link.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import { StylePropsConst } from '../../../utils/styleUtils';
import LinkEditor from '../../LinkEditor';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import ColorPicker from '../../controls/ColorPicker';

const FontStylesBlock = () => {
    const { style, actualStyleRef, updateActualStyle, focusNodeRef } = useTooltip();
    const { editor } = useEditor();
    const [isOpenLinkEditor, setIsOpenLinkEditor] = useState(false);

    const contextMenuObserver = useMemo(
        () => ({
            handleClickContextMenu: (e: Event) => {
                const focusNode = e.target as HTMLElement;
                if (focusNode.parentElement?.localName === 'a') {
                    e.preventDefault();
                    setIsOpenLinkEditor(true);
                }
            },
        }),
        []
    );

    useLayoutEffect(() => editor.registerClickContextMenuObserver(contextMenuObserver), [contextMenuObserver, editor]);

    const handleUpdateColor = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.COLOR]: value };
            updateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },
        [editor, updateActualStyle]
    );

    const handleUpdateBackground = useCallback(
        (value: string) => {
            const newStyleProp = { [StylePropsConst.BACKGROUND_COLOR]: value };
            updateActualStyle(newStyleProp);
            editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
        },

        [editor, updateActualStyle]
    );

    const handleUpdateFontWeight = useCallback(() => {
        const value = style.fontWeight === '400' ? '700' : '400';
        const newStyleProp = { [StylePropsConst.FONT_WEIGHT]: value };
        updateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
    }, [editor, style.fontWeight, updateActualStyle]);

    const handleUpdateFontStyle = useCallback(() => {
        const value = style.fontStyle === 'normal' ? 'italic' : 'normal';
        const newStyleProp = { [StylePropsConst.FONT_STYLE]: value };
        updateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
    }, [editor, style.fontStyle, updateActualStyle]);

    const handleUpdateTextDecoration = useCallback(() => {
        const value = style.textDecoration === 'normal' ? 'underline' : 'normal';

        const newStyleProp = { [StylePropsConst.TEXT_DECORATION]: value };
        updateActualStyle(newStyleProp);
        editor.triggerDecoratedUpdate({ ...actualStyleRef.current, ...newStyleProp });
    }, [editor, style.textDecoration, updateActualStyle]);

    const handleEditLink = useCallback(
        (key: NodeKey, href?: string) => {
            editor.triggerLinkEditor(key, href);
        },
        [editor]
    );

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
            <Button Icon={Link} theme="icon" onClick={() => setIsOpenLinkEditor(prev => !prev)} />
            {isOpenLinkEditor && (
                <LinkEditor
                    onClose={() => setIsOpenLinkEditor(false)}
                    activeNode={focusNodeRef.current as HTMLElement}
                    value={
                        focusNodeRef.current?.parentElement?.localName === 'a'
                            ? focusNodeRef.current?.parentElement?.getAttribute('href') || ''
                            : ''
                    }
                    onChange={handleEditLink}
                />
            )}
            <ColorPicker Icon={Color} color={color} handleUpdate={handleUpdateColor} />
            <ColorPicker Icon={BackgroundColor} color={colorBg} handleUpdate={handleUpdateBackground} />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
