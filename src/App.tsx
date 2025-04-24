import { FC } from 'react';

import Editor from './components/Editor/index';
import { HistoryProvider } from './context/HistoryContext';
import { LexicalProvider } from './context/LexicalContext';
import { StylesProvider } from './context/StylesContext';
import './styles.scss';
import './styles/tokens/base.scss';
import { initialStyle } from './utils/styleUtils';

const App: FC = () => (
    <LexicalProvider>
        <HistoryProvider>
            <StylesProvider initialSettings={initialStyle}>
                <div className="demo-main-container">
                    <Editor />
                </div>
            </StylesProvider>
        </HistoryProvider>
    </LexicalProvider>
);

export { App };
