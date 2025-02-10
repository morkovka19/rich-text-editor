import { useRef } from 'react';

import { IStyleNode } from '../../../nodes';

export const initialStyle: IStyleNode = {
    fontFamily: 'Roboto',
    fontSize: 14,
};

export enum StylePropType {
    FONT_FAMILY = 'fontFamily',
    FONT_SIZE = 'fontSize',
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

    const getStyleStr = (style?: CSSStyleDeclaration | IStyleNode) => {
        if (style) {
            return `font-family: ${style.fontFamily}; font-size: ${style.fontSize}px`;
        }
        const { fontFamily, fontSize } = styleRef.current;
        return `font-family: ${fontFamily}; font-size: ${fontSize}px`;
    };

    return {
        updateFont,
        updateFontSize,
        styleRef,
        getStyleStr,
    };
};

export default useStyle;
