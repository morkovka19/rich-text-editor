import { FC, useRef } from 'react';

import Editor from './components/Editor/index';
import { CustomEventsListeners } from './context/CustomEventsListeners';
import { DomEventsListeners } from './context/DomEventsListeners/intex';
import { EditorProvider } from './context/EditorContext';
import './styles/tokens/base.scss';

const App: FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    return (
        <EditorProvider editor={editorRef}>
            <CustomEventsListeners editor={editorRef}>
                <DomEventsListeners editor={editorRef}>
                    <Editor editorRef={editorRef} />
                </DomEventsListeners>
            </CustomEventsListeners>
        </EditorProvider>
    );
};

export { App };
