/* eslint-disable react-hooks/exhaustive-deps */
import { FC } from 'react';

import { Container } from '../../controls/Container';
import ContentEditableBlock from '../ContentEditableBlock';
import { Topbar } from '../Topbar';
import './Editor.styles.scss';
import { IEditor } from './Editor.types';

const Editor: FC<IEditor> = ({ initialText, isEditable = true, editorRef }) => {
    return (
        <Container>
            <Topbar isEditable={isEditable} />
            <ContentEditableBlock isEditable={isEditable} initialText={initialText} editorRef={editorRef}>
                {/* <div dangerouslySetInnerHTML={{ __html: editorRef.current?.innerText || '' }} /> */}
            </ContentEditableBlock>
        </Container>
    );
};

export default Editor;
