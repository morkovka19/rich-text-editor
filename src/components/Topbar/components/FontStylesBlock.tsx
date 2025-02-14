import { useCallback, useContext } from 'react';

import { EditorContext } from '../../../context/EditorContext';
import { IEditorContextProps } from '../../../context/EditorContext/EditorContext.types';
import { StylePropType } from '../../../context/EditorContext/hooks/useStyle';
import BackgroundColor from '../../../icons/topbar-font-color/backgroundColor.svg';
import Color from '../../../icons/topbar-font-color/color.svg';
import Bold from '../../../icons/topbar-font-styles/bold.svg';
import CodeBlock from '../../../icons/topbar-font-styles/codeBlock.svg';
import Italic from '../../../icons/topbar-font-styles/italic.svg';
import Link from '../../../icons/topbar-font-styles/link.svg';
import Underline from '../../../icons/topbar-font-styles/underline.svg';
import Button from '../../controls/Button';
import { ButtonsContainer } from '../../controls/ButtonsContainer';
import ColorPicker from '../../controls/ColorPicker';

const FontStylesBlock = () => {
    const context = useContext(EditorContext) as IEditorContextProps;
    const { setStyle, style } = context;

    const handleUpdateColor = useCallback(
        (value: string) => {
            setStyle(value, StylePropType.COLOR);
        },
        [setStyle]
    );

    const handleUpdateBackground = useCallback(
        (value: string) => {
            setStyle(value, StylePropType.BACKGROUND_COLOR);
        },
        [setStyle]
    );

    const handleUpdateFontWeight = useCallback(() => {
        const value = style.fontWeight === 400 ? '700' : '400';
        setStyle(value, StylePropType.FONT_WEIGHT);
    }, [setStyle, style.fontWeight]);

    const handleUpdateFontStyle = useCallback(() => {
        const value = style.fontStyle === 'normal' ? 'italic' : 'normal';
        setStyle(value, StylePropType.FONT_STYLE);
    }, [style.fontStyle, setStyle]);

    const handleUpdateTextDecoration = useCallback(() => {
        const value = style.textDecoration === 'none' ? 'underline' : 'none';
        setStyle(value, StylePropType.TEXT_DECORATION);
    }, [setStyle, style.textDecoration]);

    return (
        <ButtonsContainer>
            <Button Icon={Bold} theme="icon" onClick={handleUpdateFontWeight} isActive={style.fontWeight === 700} />
            <Button
                Icon={Italic}
                theme="icon"
                onClick={handleUpdateFontStyle}
                isActive={style.fontStyle === 'italic'}
            />
            <Button
                Icon={Underline}
                theme="icon"
                onClick={handleUpdateTextDecoration}
                isActive={style.textDecoration === 'underline'}
            />
            <Button Icon={CodeBlock} theme="icon" />
            <Button Icon={Link} theme="icon" />
            <ColorPicker Icon={Color} color={'#000000'} handleUpdate={handleUpdateColor} />
            <ColorPicker Icon={BackgroundColor} color={'#ffffff'} handleUpdate={handleUpdateBackground} />
        </ButtonsContainer>
    );
};

export default FontStylesBlock;
