import { StyleProps } from '../context/ToolbarContext';

export const initialStyle: StyleProps = {
    fontFamily: 'Roboto',
    fontSize: '15px',
    color: '#000000',
    backgroundColor: '#ffffff',
    fontWeight: '400',
    textDecoration: 'normal',
    fontStyle: 'normal',
};

export enum StylePropsConst {
    FONT_FAMILY = 'fontFamily',
    FONT_SIZE = 'fontSize',
    COLOR = 'color',
    BACKGROUND_COLOR = 'backgroundColor',
    FONT_WEIGHT = 'fontWeight',
    TEXT_DECORATION = 'textDecoration',
    FONT_STYLE = 'fontStyle',
}

export enum StylePropsStringConst {
    FONT_FAMILY = 'font-family',
    FONT_SIZE = 'font-size',
    COLOR = 'color',
    BACKGROUND_COLOR = 'background-color',
    FONT_WEIGHT = 'font-weight',
    TEXT_DECORATION = 'text-decoration',
    FONT_STYLE = 'font-style',
}

// Mapping between StylePropsConst and StylePropsStringConst
export const StyleMapping: { [key in StylePropsConst]: StylePropsStringConst } = {
    [StylePropsConst.FONT_FAMILY]: StylePropsStringConst.FONT_FAMILY,
    [StylePropsConst.FONT_SIZE]: StylePropsStringConst.FONT_SIZE,
    [StylePropsConst.COLOR]: StylePropsStringConst.COLOR,
    [StylePropsConst.BACKGROUND_COLOR]: StylePropsStringConst.BACKGROUND_COLOR,
    [StylePropsConst.FONT_WEIGHT]: StylePropsStringConst.FONT_WEIGHT,
    [StylePropsConst.TEXT_DECORATION]: StylePropsStringConst.TEXT_DECORATION,
    [StylePropsConst.FONT_STYLE]: StylePropsStringConst.FONT_STYLE,
};

// Mapping between StylePropsConst and StylePropsStringConst
export const StyleMappingToString: { [key in StylePropsStringConst]: StylePropsConst } = {
    [StylePropsStringConst.FONT_FAMILY]: StylePropsConst.FONT_FAMILY,
    [StylePropsStringConst.FONT_SIZE]: StylePropsConst.FONT_SIZE,
    [StylePropsStringConst.COLOR]: StylePropsConst.COLOR,
    [StylePropsStringConst.BACKGROUND_COLOR]: StylePropsConst.BACKGROUND_COLOR,
    [StylePropsStringConst.FONT_WEIGHT]: StylePropsConst.FONT_WEIGHT,
    [StylePropsStringConst.TEXT_DECORATION]: StylePropsConst.TEXT_DECORATION,
    [StylePropsStringConst.FONT_STYLE]: StylePropsConst.FONT_STYLE,
};

export const getStyleString = (style: StyleProps): string => {
    return Object.keys(style)
        .sort()
        .reduce((acc, key) => {
            const enumKey = key as StylePropsConst;
            if (StyleMapping[enumKey]) {
                return acc + `${StyleMapping[enumKey]}: ${style[key]}; `;
            }
            return acc;
        }, '');
};

export const getStyleState = (str: string): StyleProps => {
    return str.split(';').reduce((style: StyleProps, part: string) => {
        const [name, value] = part.split(':');
        if (name && value) {
            const nameProp = name.trim() as StylePropsStringConst;
            const mappedName = StyleMappingToString[nameProp];
            if (mappedName) {
                style[mappedName] = value.trim();
            }
        }
        return style;
    }, {});
};

export const getStyleProp = (key: string, style: StyleProps) => {
    switch (key) {
        case 'fontFamily':
            return { fontFamily: style.fontFamily };
        case 'fontSize':
            return { fontSize: style.fontSize };
        case 'textDecoration':
            return { textDecoration: style.textDecoration };
        case 'fontWeight':
            return { fontWeight: style.fontWeight };
        case 'color':
            return { color: style.color };
        case 'backgroundColor':
            return { backgroundColor: style.backgroundColor };
        default:
            return {};
    }
};
