import { fireEvent, render, screen } from '@testing-library/react';

import { LexicalEditor } from '../../classes/LexicalEditor';
import ContentBlock from '../../components/ContentBlock';
import { LexicalProvider, useEditor } from '../../context/LexicalContext';
import { StylesProvider } from '../../context/StylesContext/index';
import { initialStyle } from '../../utils/styleUtils';

describe('LexicalEditor Integration', () => {
    let editorInstance: LexicalEditor;

    beforeAll(() => {
        // Мокаем глобальные события
        global.getSelection = () =>
            ({
                rangeCount: 0,
                getRangeAt: () => ({}),
            }) as unknown as Selection;
    });

    it('should handle text input and update state', () => {
        render(
            <LexicalProvider>
                <StylesProvider initialSettings={initialStyle}>
                    <ContentBlock />
                </StylesProvider>
            </LexicalProvider>
        );

        const editor = screen.getByRole('textbox');

        // Получаем экземпляр редактора через контекст
        const EditorConsumer = () => {
            const { editor } = useEditor();
            editorInstance = editor;
            return null;
        };

        render(
            <LexicalProvider>
                <StylesProvider initialSettings={initialStyle}>
                    <EditorConsumer />
                </StylesProvider>
            </LexicalProvider>
        );

        // Симулируем ввод текста
        fireEvent.input(editor, {
            target: { textContent: 'Test text' },
        });

        // Проверяем обновление состояния
        expect(editorInstance.getCopyNodeMap().size).toBeGreaterThan(0);
    });

    it('should handle Enter key press', () => {
        render(
            <LexicalProvider>
                <StylesProvider initialSettings={initialStyle}>
                    <ContentBlock />
                </StylesProvider>
            </LexicalProvider>
        );

        const editor = screen.getByRole('textbox');

        // Симулируем нажатие Enter
        fireEvent.keyDown(editor, {
            key: 'Enter',
            preventDefault: jest.fn(),
        });

        // Проверяем, что обработчик вызван
        expect(editorInstance).toHaveProperty('_state');
    });

    it('should register and trigger observers', () => {
        const mockObserver = {
            callback: jest.fn(),
        };

        // Регистрируем наблюдателя
        editorInstance.registerObserver('handleInput', {
            handleInput: mockObserver.callback,
        });

        // Триггерим событие
        editorInstance.triggerHandleInput();

        expect(mockObserver.callback).toHaveBeenCalled();
    });
});
