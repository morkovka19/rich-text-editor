import { FC, useRef } from 'react';

import ContentBlock, { ContentBlockProps } from '../ContentBlock';
import { Container } from '../controls/Container';
import './Editor.styles.scss';
import { IEditor } from './Editor.types';

const Editor: FC<IEditor> = () => {
    const ref = useRef<HTMLDivElement & ContentBlockProps>(null);

    return (
        <Container>
            {/* <Topbar isEditable={props.isEditable || true} /> */}
            <ContentBlock ref={ref} />
        </Container>
    );
};

export default Editor;
