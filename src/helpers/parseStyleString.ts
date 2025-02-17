import { IStyleNode } from '../types/nodes';

export const parseStyleString = (style: string, actualStyle: IStyleNode) => {
    const styleObj: IStyleNode = { ...actualStyle };
    const parts = style.replace(' ', '').split(';');
    for (const part of parts) {
        const [styleProperty, styleValue] = part.split(':');
        switch (styleProperty) {
            case 'font-family':
                styleObj.fontFamily = styleValue;
                break;
            case 'font-size':
                styleObj.fontSize = Number(styleValue.replace('px', ''));
                break;
            case 'color':
                styleObj.color = styleValue;
                break;
            case 'background-color':
                styleObj.backgroundColor = styleValue;
                break;
            case 'font-weight':
                styleObj.fontWeight = Number(styleValue);
                break;
            case 'font-style':
                styleObj.fontStyle = styleValue;
                break;
            case 'text-decoration':
                styleObj.textDecoration = styleValue;
                break;
            default:
                break;
        }
    }

    return styleObj;
};

// color: string;
// backgroundColor: string;
// fontWeight?: number;
// fontStyle: string;
// textDecoration: string;
