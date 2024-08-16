import { FC, useRef } from 'react';

import Editor from './components/Editor/index';
import { DomCommandProvider } from './context/DomCommandContext';
import { EditorCommandProvider } from './context/EditorCommandContext';
import { EditorProvider } from './context/EditorContext';
import './styles/tokens/base.scss';

const App: FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    return (
        <EditorProvider>
            <DomCommandProvider editorRef={editorRef}>
                <EditorCommandProvider>
                    <Editor editorRef={editorRef} />
                </EditorCommandProvider>
            </DomCommandProvider>
        </EditorProvider>
    );
};

export { App };
