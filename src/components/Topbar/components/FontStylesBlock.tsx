import { useCallback, useMemo, useState } from 'react';

import { useEditor } from '../../../context/EditorContext/hooks/useEditor';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import { ActionWithTag, TAGS } from '../../../helpers/constants';
import BackgroundColor from '../../../icons/topbar-font-color/backgroundColor.svg';
import Color from '../../../icons/topbar-font-color/color.svg';
import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
import Link from '../../../icons/topbar-font-styles/link.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import { NodeKeyType } from '../../../types/nodes';
import LinkEditor from '../../LinkEditor';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import ColorPicker from '../../controls/ColorPicker';

const FontStylesBlock = () => {
    const [isOpenLink, setIsOpenLink] = useState(false);
    const { updateStyle, style, activeNode, focuseNode, editLinkTag } = useEditor();

    const handleUpdateColor = useCallback(
        (value: string) => {
            updateStyle(value, StylePropType.COLOR);
        },
        [updateStyle]
    );

    const handleUpdateBackground = useCallback(
        (value: string) => {
            updateStyle(value, StylePropType.BACKGROUND_COLOR);
        },
        [updateStyle]
    );

    const handleUpdateFontWeight = useCallback(() => {
        const value = style.fontWeight === 400 ? '700' : '400';
        updateStyle(value, StylePropType.FONT_WEIGHT);
    }, [updateStyle, style.fontWeight]);

    const handleUpdateFontStyle = useCallback(() => {
        const value = style.fontStyle === 'normal' ? 'italic' : 'normal';
        updateStyle(value, StylePropType.FONT_STYLE);
    }, [style.fontStyle, updateStyle]);

    const handleUpdateTextDecoration = useCallback(() => {
        const value = style.textDecoration === 'none' ? 'underline' : 'none';
        updateStyle(value, StylePropType.TEXT_DECORATION);
    }, [updateStyle, style.textDecoration]);

    const activeStyle = useMemo(() => activeNode?.getStyle() || style, [activeNode, style]);

    const handleEditLink = useCallback(
        (action: ActionWithTag, key: NodeKeyType, href?: string) => {
            editLinkTag(action, key, href);
        },
        [editLinkTag]
    );

    return (
        <ButtonsContainer>
            <Button
                Icon={Bold}
                theme="icon"
                onClick={handleUpdateFontWeight}
                isActive={activeStyle.fontWeight === 700}
            />
            <Button
                Icon={Italic}
                theme="icon"
                onClick={handleUpdateFontStyle}
                isActive={activeStyle.fontStyle === 'italic'}
            />
            <Button
                Icon={Underline}
                theme="icon"
                onClick={handleUpdateTextDecoration}
                isActive={activeStyle.textDecoration === 'underline'}
            />
            <Button Icon={CodeBlock} theme="icon" />
            <Button Icon={Link} theme="icon" onClick={() => setIsOpenLink(prev => !prev)} />
            {isOpenLink && (
                <LinkEditor
                    onClose={() => setIsOpenLink(false)}
                    activeNode={focuseNode as HTMLElement}
                    value={focuseNode?.nodeName === TAGS.LINK ? focuseNode?.textContent || '' : ''}
                    onChange={handleEditLink}
                />
            )}
            <ColorPicker Icon={Color} color={activeStyle.color || '#000000'} handleUpdate={handleUpdateColor} />
            <ColorPicker
                Icon={BackgroundColor}
                color={activeStyle.backgroundColor || '#ffffff'}
                handleUpdate={handleUpdateBackground}
            />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
