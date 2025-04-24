import { StyleProps } from '../../context/StylesContext';
import {
    StyleMapping,
    StyleMappingToString,
    StylePropsConst,
    StylePropsStringConst,
    getStyleState,
    getStyleString,
    initialStyle,
    initialStyleParent,
} from '../../utils/styleUtils';

describe('Style Constants', () => {
    test('initialStyle should have correct default values', () => {
        expect(initialStyle).toEqual({
            fontFamily: 'Roboto',
            fontSize: '15px',
            color: '#000000',
            backgroundColor: '',
            fontWeight: '400',
            textDecoration: 'normal',
            fontStyle: 'normal',
        });
    });

    test('initialStyleParent should have correct default values', () => {
        expect(initialStyleParent).toEqual({
            textAlign: 'left',
        });
    });

    test('StylePropsConst should have correct enum values', () => {
        expect(StylePropsConst).toEqual({
            FONT_FAMILY: 'fontFamily',
            FONT_SIZE: 'fontSize',
            COLOR: 'color',
            BACKGROUND_COLOR: 'backgroundColor',
            FONT_WEIGHT: 'fontWeight',
            TEXT_DECORATION: 'textDecoration',
            FONT_STYLE: 'fontStyle',
            TEXT_ALIGN: 'textAlign',
        });
    });

    test('StylePropsStringConst should have correct enum values', () => {
        expect(StylePropsStringConst).toEqual({
            FONT_FAMILY: 'font-family',
            FONT_SIZE: 'font-size',
            COLOR: 'color',
            BACKGROUND_COLOR: 'background-color',
            FONT_WEIGHT: 'font-weight',
            TEXT_DECORATION: 'text-decoration',
            FONT_STYLE: 'font-style',
            TEXT_ALIGN: 'text-align',
        });
    });
});

describe('Style Mappings', () => {
    test('StyleMapping should correctly map StylePropsConst to StylePropsStringConst', () => {
        expect(StyleMapping).toEqual({
            fontFamily: 'font-family',
            fontSize: 'font-size',
            color: 'color',
            backgroundColor: 'background-color',
            fontWeight: 'font-weight',
            textDecoration: 'text-decoration',
            fontStyle: 'font-style',
            textAlign: 'text-align',
        });
    });

    test('StyleMappingToString should correctly map StylePropsStringConst to StylePropsConst', () => {
        expect(StyleMappingToString).toEqual({
            'font-family': 'fontFamily',
            'font-size': 'fontSize',
            color: 'color',
            'background-color': 'backgroundColor',
            'font-weight': 'fontWeight',
            'text-decoration': 'textDecoration',
            'font-style': 'fontStyle',
            'text-align': 'textAlign',
        });
    });

    test('Mappings should be bidirectional', () => {
        Object.entries(StyleMapping).forEach(([key, value]) => {
            expect(StyleMappingToString[value]).toBe(key);
        });
    });
});

describe('Style Conversion Functions', () => {
    describe('getStyleString', () => {
        test('should convert StyleProps to CSS string', () => {
            const style: StyleProps = {
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#000000',
                fontWeight: 'bold',
            };

            const result = getStyleString(style);
            expect(result).toContain('font-family: Arial;');
            expect(result).toContain('font-size: 16px;');
            expect(result).toContain('color: #ffffff;');
            expect(result).toContain('background-color: #000000;');
            expect(result).toContain('font-weight: bold;');
        });

        test('should ignore empty values', () => {
            const style: StyleProps = {
                fontFamily: 'Arial',
                fontSize: '',
                color: '#ffffff',
                backgroundColor: '',
                fontWeight: 'bold',
            };

            const result = getStyleString(style);

            // Проверяем что содержит непустые значения
            expect(result).toContain('font-family: Arial;');
            expect(result).toContain('color: #ffffff;');
            expect(result).toContain('font-weight: bold;');

            // Проверяем что не содержит пустых значений
            expect(result).not.toContain('font-size: ;');
            expect(result).not.toContain('background-color: ;');

            // Проверяем общее количество свойств (должно быть 3)
            const propertyCount = result.split(';').filter(part => part.trim() !== '').length;
            expect(propertyCount).toBe(3);
        });

        test('should return empty string for empty style', () => {
            const style: StyleProps = {};
            const result = getStyleString(style);
            expect(result).toBe('');
        });

        test('should sort properties alphabetically', () => {
            const style: StyleProps = {
                color: 'red',
                fontFamily: 'Arial',
                backgroundColor: 'blue',
            };

            const result = getStyleString(style);
            const expectedOrder = ['background-color: blue', 'color: red', 'font-family: Arial'];

            expectedOrder.forEach((prop, index) => {
                expect(result.split(';')[index].trim()).toBe(prop);
            });
        });
    });

    describe('getStyleState', () => {
        test('should convert CSS string to StyleProps', () => {
            const cssString =
                'font-family: Arial; font-size: 16px; color: #ffffff; background-color: #000000; font-weight: bold;';
            const result = getStyleState(cssString);

            expect(result).toEqual({
                fontFamily: 'Arial',
                fontSize: '16px',
                color: '#ffffff',
                backgroundColor: '#000000',
                fontWeight: 'bold',
            });
        });

        test('should handle empty string', () => {
            const result = getStyleState('');
            expect(result).toEqual({});
        });

        test('should ignore malformed parts', () => {
            const cssString = 'font-family: Arial; invalid; color: #ffffff; :; background-color: #000000;';
            const result = getStyleState(cssString);

            expect(result).toEqual({
                fontFamily: 'Arial',
                color: '#ffffff',
                backgroundColor: '#000000',
            });
        });

        test('should trim whitespace', () => {
            const cssString = '  font-family  :   Arial  ;  color  :  #ffffff  ';
            const result = getStyleState(cssString);

            expect(result).toEqual({
                fontFamily: 'Arial',
                color: '#ffffff',
            });
        });

        test('should handle unknown properties', () => {
            const cssString = 'unknown: value; font-family: Arial;';
            const result = getStyleState(cssString);

            expect(result).toEqual({
                fontFamily: 'Arial',
            });
        });
    });

    test('getStyleString and getStyleState should be inverses', () => {
        const originalStyle: StyleProps = {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: '#000000',
            fontWeight: 'bold',
            textDecoration: 'underline',
            fontStyle: 'italic',
            textAlign: 'center',
        };

        const cssString = getStyleString(originalStyle);
        const convertedStyle = getStyleState(cssString);

        expect(convertedStyle).toEqual(originalStyle);
    });
});
