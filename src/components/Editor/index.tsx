/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useRef } from 'react';

import { EditorProvider } from '../../context/EditorContext';
import ContentEditableBlock from '../ContentEditableBlock';
import { IContentEditableBlock } from '../ContentEditableBlock/ContentEditableBlock.types';
import { Topbar } from '../Topbar';
import { Container } from '../controls/Container';
import './Editor.styles.scss';
import { IEditor } from './Editor.types';

const Editor: FC<IEditor> = props => {
    const ref = useRef<HTMLDivElement & IContentEditableBlock>(null);

    return (
        <EditorProvider editor={ref}>
            <Container>
                <Topbar isEditable={props.isEditable || true} />
                <ContentEditableBlock ref={ref} {...props}></ContentEditableBlock>
            </Container>
        </EditorProvider>
    );
};

export default Editor;
