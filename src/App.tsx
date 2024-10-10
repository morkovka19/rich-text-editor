import { FC } from 'react';

import './App.styles.scss';
import Editor from './components/Editor/index';
import './styles/tokens/base.scss';

const App: FC = () => (
    <div className="demo-main-container">
        <Editor />
    </div>
);

export { App };
