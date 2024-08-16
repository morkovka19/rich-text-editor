import { FC, useCallback, useEffect } from 'react';

import { useEditorCommand } from '../../context/EditorCommandContext';
import { useEditor } from '../../context/EditorContext';
import { Container } from '../../controls/Container';
import ContentEditableBlock from '../ContentEditableBlock';
import { Topbar } from '../Topbar';
import './Editor.styles.scss';
import { IEditor } from './Editor.types';
import { addRoot } from './helpers/addRoot';

const Editor: FC<IEditor> = ({ initialText, isEditable = true, editorRef }) => {
    const { state } = useEditor();
    const { addDivRoot, addParagraph } = useEditorCommand();

    const addInitialRoot = useCallback(() => {
        addRoot(state, addDivRoot, addParagraph);
    }, [addDivRoot, addParagraph, state]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.addEventListener('click', addInitialRoot, { once: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Container>
            <Topbar isEditable={isEditable} />
            <ContentEditableBlock isEditable={isEditable} initialText={initialText} editorRef={editorRef} />
            <div dangerouslySetInnerHTML={{ __html: '' }} />
        </Container>
    );
};

export default Editor;
