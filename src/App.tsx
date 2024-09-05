import { FC, useRef } from 'react';

import Editor from './components/Editor/index';
import { EditorProvider } from './context/EditorContext';
import './styles/tokens/base.scss';

const App: FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    return (
        <EditorProvider editor={editorRef}>
            <Editor editorRef={editorRef} />
        </EditorProvider>
    );
};

export { App };
