import { FC } from 'react';

import Editor from './components/Editor/index';
import { FormattingProvider } from './context/FormattingContext/index';
import { HistoryProvider } from './context/HistoryContext';
import { LexicalProvider } from './context/LexicalContext';
import './styles.scss';
import './styles/tokens/base.scss';
import { initialStyle } from './utils/styleUtils';

const RichEditor: FC = () => (
    <div className="demo-main-container">
        <LexicalProvider>
            <HistoryProvider>
                <FormattingProvider initialSettings={initialStyle}>
                    <Editor />
                </FormattingProvider>
            </HistoryProvider>
        </LexicalProvider>
    </div>
);

export { RichEditor };
