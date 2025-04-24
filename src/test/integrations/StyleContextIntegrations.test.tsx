/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, render } from '@testing-library/react';
import React from 'react';

import { LexicalProvider } from '../../context/LexicalContext';
import { StylesProvider, useStyles } from '../../context/StylesContext';
import { TAGS } from '../../utils/constants';

// Добавляем импорт LexicalProvider

describe('StylesProvider Integration Tests (with LexicalProvider)', () => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <LexicalProvider>
            <StylesProvider initialSettings={{}}>{children}</StylesProvider>
        </LexicalProvider>
    );

    it('should provide initial context values', () => {
        let contextValue: any;
        const TestComponent = () => {
            contextValue = useStyles();
            return <div data-testid="test-element">Test</div>;
        };

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        expect(contextValue.style).toEqual({
            color: '#000000',
            fontFamily: 'Roboto',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            textDecoration: 'normal',
            backgroundColor: '',
        });
        expect(contextValue.tag).toBe(TAGS.NORMAL);
        expect(contextValue.actualStyleRef.current).toEqual({});
        expect(contextValue.focusNodeRef.current).toBeNull();
    });

    it('should update style when handleDecorate is called', () => {
        let contextValue: any;
        const TestComponent = () => {
            contextValue = useStyles();
            return <div data-testid="test-element">Test</div>;
        };

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        act(() => {
            contextValue.handleDecorate({ color: 'red', fontSize: '16px' });
        });

        expect(contextValue.style).toEqual({
            color: 'red',
            backgroundColor: '',
            fontFamily: 'Roboto',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: '400',
            textDecoration: 'normal',
        });
    });

    it('should update tag when handleUpdateTag is called', () => {
        let contextValue: any;
        const TestComponent = () => {
            contextValue = useStyles();
            return <div data-testid="test-element">Test</div>;
        };

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        act(() => {
            contextValue.handleUpdateTag(TAGS.H1);
        });

        expect(contextValue.tag).toBe(TAGS.H1);
        expect(contextValue.style).toEqual({
            backgroundColor: '',
            color: '#000000',
            fontFamily: 'Roboto',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            textDecoration: 'normal',
        });
    });

    it('should update actualStyleRef when handleUpdateActualStyle is called', () => {
        let contextValue: any;
        const TestComponent = () => {
            contextValue = useStyles();
            return <div data-testid="test-element">Test</div>;
        };

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        act(() => {
            contextValue.handleUpdateActualStyle({ fontWeight: 'bold', color: 'blue' });
        });

        expect(contextValue.actualStyleRef.current).toEqual({
            fontWeight: 'bold',
            color: 'blue',
        });
    });

    it('should update styleParent when handleDecorateParent is called', () => {
        let contextValue: any;
        const TestComponent = () => {
            contextValue = useStyles();
            return <div data-testid="test-element">Test</div>;
        };

        render(
            <Wrapper>
                <TestComponent />
            </Wrapper>
        );

        act(() => {
            contextValue.handleDecorateParent({ textAlign: 'center' });
        });

        expect(contextValue.styleParent).toEqual({
            backgroundColor: '',
            color: '#000000',
            fontFamily: 'Roboto',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: '400',
            textAlign: 'center',
            textDecoration: 'normal',
        });
    });

    it('should throw error when useStyles is used outside provider', () => {
        // Сохраняем оригинальную console.error чтобы избежать вывода ошибки в консоль
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => {
            const TestComponent = () => {
                useStyles();
                return null;
            };
            render(<TestComponent />);
        }).toThrow('useStyles must be used within an StylesProvider');

        // Восстанавливаем console.error
        console.error = originalError;
    });
});
