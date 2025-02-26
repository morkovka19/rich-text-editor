import { FC } from 'react';

import './App.styles.scss';
import Editor from './components/Editor/index';
import { LexicalProvider } from './context/LexicalContext';
import './styles/tokens/base.scss';

const App: FC = () => (
    <LexicalProvider>
        <div className="demo-main-container">
            <Editor />
        </div>
    </LexicalProvider>
);

export { App };
