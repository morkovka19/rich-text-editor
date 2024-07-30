import { FC, useEffect, useRef } from 'react';

import { useCommands } from '../../context/CommandsContext/CommandsContext';
import { useEditor } from '../../context/EditorContext/EditorContext';
import { useListeners } from '../../context/EventListenersContext/EventListenersContext';
import { Container } from '../../controls/Container';
import ContentEditableBlock from '../ContentEditableBlock';
import { ILexicalNode } from '../nodes/LexicalNode.types';
import { IEditor } from './Editir.types';
import './Editor.styles.scss';

const Editor: FC<IEditor> = ({ initialText, isEditable = true }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const { executeCommand } = useCommands();
    const { state, addNode, removeNode } = useEditor();
    const { addEventListener, removeEventListener } = useListeners();

    useEffect(() => {
        if (editorRef.current) {
            const handleInput = (event: Event) => {
                const target = event.target as HTMLDivElement;
                if (target.isContentEditable) {
                    executeCommand('input', target.innerText);
                }
            };

            const handleKeyDown = (event: KeyboardEvent) => {
                if (event.key === 'Enter') {
                    const node: ILexicalNode = {
                        type: 'paragraph',
                        key: `node-${Date.now()}`,
                        prev: null,
                        next: null,
                        children: [],
                        parent: null,
                    };
                    addNode(node);
                } else if (event.key === 'Backspace') {
                    const lastNodeKey = Array.from(state.nodeMap.keys()).pop();
                    if (lastNodeKey) {
                        removeNode(lastNodeKey);
                    }
                }
            };

            addEventListener('input', handleInput);
            addEventListener('keydown', handleKeyDown);

            return () => {
                removeEventListener('input', handleInput);
                removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [addEventListener, addNode, executeCommand, removeEventListener, removeNode, state.nodeMap]);

    return (
        <Container>
            <ContentEditableBlock isEditable={isEditable} initialText={initialText} editorRef={editorRef} />
            <div dangerouslySetInnerHTML={{ __html: '' }} />
        </Container>
    );
};

export default Editor;
