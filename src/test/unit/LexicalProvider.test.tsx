import { render } from '@testing-library/react';

import { LexicalEditor } from '../../classes/LexicalEditor';
import { LexicalProvider, useEditor } from '../../context/LexicalContext';

describe('LexicalProvider', () => {
    it('should provide editor instance', () => {
        const TestComponent = () => {
            const { editor } = useEditor();
            expect(editor).toBeInstanceOf(LexicalEditor);
            return null;
        };

        render(
            <LexicalProvider>
                <TestComponent />
            </LexicalProvider>
        );
    });
});
