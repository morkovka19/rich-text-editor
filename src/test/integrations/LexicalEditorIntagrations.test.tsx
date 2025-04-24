/* eslint-disable @typescript-eslint/no-explicit-any */
import { LexicalEditor } from '../../classes/LexicalEditor';

describe('LexicalEditor Integration', () => {
    let editor: LexicalEditor;
    let container: HTMLElement;

    beforeEach(() => {
        // Создаем реальный контейнер
        container = document.createElement('div');
        document.body.appendChild(container);

        // Создаем экземпляр редактора с реальным состоянием
        editor = new LexicalEditor();
    });

    afterEach(() => {
        // Очищаем DOM после каждого теста
        document.body.removeChild(container);
    });

    it('should initialize with container', () => {
        editor.start(container);
        expect(editor['_container']).toBe(container);
    });

    it('should handle Enter key press', () => {
        editor.start(container);
        const event = new KeyboardEvent('keydown', { key: 'Enter' });

        // Можно добавить spy на метод triggerHandleEnter
        const spy = jest.spyOn(editor as any, 'triggerHandleEnter');

        container.dispatchEvent(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should register and trigger observers', () => {
        editor.start(container);

        const mockObserver = {
            handleSelect: jest.fn(),
            handleClick: jest.fn(),
        };

        // Регистрируем наблюдателя
        editor.registerObserver('handleSelect', mockObserver);
        editor.registerObserver('handleClick', mockObserver);

        // Триггерим события
        const clickEvent = new MouseEvent('click');
        container.dispatchEvent(clickEvent);

        const selection = document.getSelection();
        (editor as any).triggerSelect();

        expect(mockObserver.handleClick).toHaveBeenCalledWith(clickEvent);
        expect(mockObserver.handleSelect).toHaveBeenCalledWith(selection);
    });
});
