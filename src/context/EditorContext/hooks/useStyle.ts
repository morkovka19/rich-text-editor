import { useRef } from 'react';

import { parseStyleString } from '../../../helpers/parseStyleString';
import { IStyleNode } from '../../../types/nodes';

export const initialStyle: IStyleNode = {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#000000',
    backgroundColor: '#ffffff',
    fontWeight: 400,
    fontStyle: 'normal',
    textDecoration: 'none',
};

export enum StylePropType {
    FONT_FAMILY = 'fontFamily',
    FONT_SIZE = 'fontSize',
    COLOR = 'color',
    BACKGROUND_COLOR = 'backgroundColor',
    FONT_WEIGHT = 'fontWeight',
    FONT_STYLE = 'fontStyle',
    TEXT_DECORATION = 'textDecoration',
}

const useStyle = () => {
    const styleInit = initialStyle;
    const styleRef = useRef(styleInit);
    styleRef.current = styleInit;

    const updateFont = (value: string) => {
        styleRef.current.fontFamily = value;
    };

    const updateFontSize = (value: number) => {
        styleRef.current.fontSize = value;
    };

    const updateColor = (value: string) => {
        styleRef.current.color = value;
    };

    const updateFontWeight = (value: number) => {
        styleRef.current.fontWeight = value;
    };

    const updateBackgroundColor = (value: string) => {
        styleRef.current.backgroundColor = value;
    };

    const updateFontStyle = (value: string) => {
        styleRef.current.fontStyle = value;
    };

    const updateTextDecoration = (value: string) => {
        styleRef.current.textDecoration = value;
    };

    const getStyleStr = (style?: CSSStyleDeclaration | IStyleNode) => {
        if (style) {
            return `font-family: ${style.fontFamily}; font-size: ${style.fontSize}px; color: ${style.color}; background: ${style.backgroundColor || '#ffffff'}; font-weight: ${style.fontWeight}; font-style: ${style.fontStyle}; text-decoration: ${style.textDecoration}; `;
        }
        const { fontFamily, fontSize, color, backgroundColor, fontWeight, fontStyle, textDecoration } =
            styleRef.current;
        return `font-family: ${fontFamily}; font-size: ${fontSize}px; color: ${color}; background: ${backgroundColor || '#ffffff'}; font-weight: ${fontWeight}; font-style: ${fontStyle}; text-decoration: ${textDecoration}`;
    };

    const updateWholeStyle = (style: string | CSSStyleDeclaration) => {
        const newStyle = parseStyleString(typeof style === 'string' ? style : style.cssText, styleRef.current);
        styleRef.current = { ...styleRef.current, ...newStyle };
    };

    return {
        updateFont,
        updateFontSize,
        styleRef,
        getStyleStr,
        updateColor,
        updateBackgroundColor,
        updateFontWeight,
        updateFontStyle,
        updateTextDecoration,
        updateWholeStyle,
    };
};

export default useStyle;
