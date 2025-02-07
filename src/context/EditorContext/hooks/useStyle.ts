import { useRef } from 'react';

const initialStyle = {
    font: '',
};
const useStyle = () => {
    const styleInit = initialStyle;
    const styleRef = useRef(styleInit);
    styleRef.current = styleInit;

    const updateFont = (value: string) => {
        styleRef.current.font = value;
    };

    const getStyleStr = (style?: CSSStyleDeclaration) => {
        if (style) {
            return `font-family: ${style.fontFamily}`;
        }
        const { font } = styleRef.current;
        return `font-family: ${font}`;
    };

    return {
        updateFont,
        styleRef,
        getStyleStr,
    };
};

export default useStyle;
