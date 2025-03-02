import { FC } from 'react';

import Editor from './components/Editor/index';
import { LexicalProvider } from './context/LexicalContext';
import { TooltipProvider } from './context/ToolbarContext';
import './styles.scss';
import './styles/tokens/base.scss';
import { initialStyle } from './utils/styleUtils';

const App: FC = () => (
    <LexicalProvider>
        <TooltipProvider initialSettings={initialStyle}>
            <div className="demo-main-container">
                <Editor />
            </div>
        </TooltipProvider>
    </LexicalProvider>
);

export { App };
