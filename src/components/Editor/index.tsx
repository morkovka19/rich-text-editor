import { FC, useRef } from 'react';

import { AddButton } from '../AddButton';
import ContentBlock, { ContentBlockProps } from '../ContentBlock';
import { Toolbar } from '../Toolbar';
import { Container } from '../controls/Container';
import { IEditor } from './types';

const Editor: FC<IEditor> = ({ isEditable }) => {
    const ref = useRef<HTMLDivElement & ContentBlockProps>(null);

    return (
        <Container>
            <Toolbar isEditable={isEditable || true} />
            <AddButton />
            <ContentBlock ref={ref} />
        </Container>
    );
};

export default Editor;
