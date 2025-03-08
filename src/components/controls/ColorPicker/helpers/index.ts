import { regHex } from '../../../../utils/regex';
import { Color, HSV, RGB } from '../types';
import { COLOR_FORMAT, MAX_RGB_NUMBER, N_MAX_LINE } from './constants';

export const convertToHex = (value: string) => {
    if (!value.startsWith('#')) {
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx) {
            throw new Error('2d context not supported or canvas already initialized');
        }
        ctx.fillStyle = value;
        return ctx.fillStyle;
    }
    return value;
};

export const convertHexToRgb = (hex: string) => {
    const rgbArr = (
        hex
            .replace(regHex, (m, r, g, b) => `#${r}${r}${g}${g}${b}${b}`)
            .substring(1)
            .match(/.{2}/g) || []
    ).map(x => parseInt(x, 16));
    return {
        r: rgbArr[0],
        g: rgbArr[1],
        b: rgbArr[2],
    };
};

export const convertHexToRgbStr = (hex: string) => {
    const rgb = convertHexToRgb(hex);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
};

export const convertRgbToHsv = ({ r, g, b }: RGB) => {
    const rBuff = r / MAX_RGB_NUMBER;
    const gBuff = g / MAX_RGB_NUMBER;
    const bBuff = b / MAX_RGB_NUMBER;

    const max = Math.max(rBuff, gBuff, bBuff);
    const d = max - Math.min(rBuff, gBuff, bBuff);

    const h = d
        ? (max === rBuff
              ? (gBuff - bBuff) / d + (gBuff < bBuff ? 6 : 0)
              : max === gBuff
                ? 2 + (bBuff - rBuff) / d
                : 4 + (rBuff - gBuff) / d) * 60
        : 0;

    const s = max ? (d / max) * N_MAX_LINE : 0;
    const v = max * N_MAX_LINE;

    return { h, s, v };
};

export const convertHsvToRgb = ({ h, s, v }: HSV) => {
    const sBuff = s / N_MAX_LINE;
    const vBuff = v / N_MAX_LINE;

    const i = ~~(h / 60);
    const f = h / 60 - i;
    const p = vBuff * (1 - sBuff);
    const q = vBuff * (1 - sBuff * f);
    const t = vBuff * (1 - sBuff * (1 - f));
    const index = i % 6;
    const r = Math.round(Math.min(Math.max([vBuff, q, p, p, t, vBuff][index] * MAX_RGB_NUMBER, 0), MAX_RGB_NUMBER));
    const g = Math.round(Math.min(Math.max([t, vBuff, vBuff, q, p, p][index] * MAX_RGB_NUMBER, 0), MAX_RGB_NUMBER));
    const b = Math.round(Math.min(Math.max([p, p, t, vBuff, vBuff, q][index] * MAX_RGB_NUMBER, 0), MAX_RGB_NUMBER));
    return { b, g, r };
};

export const convertRgbToHex = ({ b, g, r }: RGB) => `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;

export const transformColor = <M extends keyof Color, C extends Color[M]>(format: M, color: C): Color => {
    let hex: Color[COLOR_FORMAT.HEX] = convertToHex('#121212');
    let rgb: Color[COLOR_FORMAT.RGB] = convertHexToRgb(hex);
    let hsv: Color[COLOR_FORMAT.HSV] = convertRgbToHsv(rgb);
    if (format === COLOR_FORMAT.HEX) {
        const value = color as Color[COLOR_FORMAT.HEX];
        hex = convertToHex(value);
        rgb = convertHexToRgb(hex);
        hsv = convertRgbToHsv(rgb);
    } else if (format === COLOR_FORMAT.RGB) {
        const value = color as Color[COLOR_FORMAT.RGB];
        rgb = value;
        hex = convertRgbToHex(rgb);
        hsv = convertRgbToHsv(rgb);
    } else if (format === COLOR_FORMAT.HSV) {
        const value = color as Color[COLOR_FORMAT.HSV];
        hsv = value;
        rgb = convertHsvToRgb(hsv);
        hex = convertRgbToHex(rgb);
    }
    return { hex, hsv, rgb };
};
export const clamp = (value: number, max: number, min: number) => (value > max ? max : value < min ? min : value);
export const calculateZoomLevel = (element: Element | null) => {
    let zoom = 1;
    let activeElement = element;
    while (activeElement) {
        zoom *= Number(window.getComputedStyle(activeElement).getPropertyValue('zoom'));
        activeElement = activeElement.parentElement;
    }
    return zoom;
};

export const convertStrToRGB = (color: string) => {
    if (color.startsWith('rgb')) {
        const [r, g, b] = color.replace('rgb(', '').replace(')', '').split(', ');
        const convertColor: RGB = { r: Number(r), g: Number(g), b: Number(b) };
        return convertColor;
    }

    return { r: 0, g: 0, b: 0 } as RGB;
};
