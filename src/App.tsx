import { FC } from 'react';

import Editor from './components/Editor/index';
import { FormattingProvider } from './context/FormattingContext/index';
import { HistoryProvider } from './context/HistoryContext';
import { LexicalProvider } from './context/LexicalContext';
import './styles.scss';
import './styles/tokens/base.scss';
import { initialStyle } from './utils/styleUtils';

const App: FC = () => (
    <LexicalProvider>
        <HistoryProvider>
            <FormattingProvider initialSettings={initialStyle}>
                <div className="demo-main-container">
                    <Editor />
                </div>
            </FormattingProvider>
        </HistoryProvider>
    </LexicalProvider>
);

export { App };
