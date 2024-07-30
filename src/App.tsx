import { FC } from 'react';

import Editor from './components/Editor/index';
import { CommandsProvider } from './context/CommandsContext/CommandsContext';
import { EditorProvider } from './context/EditorContext/EditorContext';
import { ListenersProvider } from './context/EventListenersContext/EventListenersContext';

const App: FC = () => {
    return (
        <ListenersProvider>
            <CommandsProvider>
                <EditorProvider>
                    <Editor />
                </EditorProvider>
            </CommandsProvider>
        </ListenersProvider>
    );
};

export { App };
