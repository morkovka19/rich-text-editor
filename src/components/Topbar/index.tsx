import { FC, useCallback } from 'react';

import { useEditor } from '../../context/EditorContext';
import './Topbar.styles.scss';
import { ITopbar } from './Topbar.types';

const Topbar: FC<ITopbar> = () => {
    const { state } = useEditor();

    const handleOpenHTML = useCallback(() => {
        console.log(state);
    }, [state]);

    return (
        <>
            <div className="topbar">
                <div className="topbar__history">undo redo</div>
                <div className="topbar__tabs">tabs</div>
                <div className="topbar__fonts">fonts</div>
                <div className="topbar__fonts-sizes">fonts-sizes</div>
                <div className="topbar__text-styles">text-styles</div>
                <div className="topbar__special-test-styles">text-styles-special</div>
                <div className="topbar__inserted-nodes">text-styles-special</div>
                <div className="topbar__inserted-nodes">text-styles-special</div>
                <div className="topbar__text-align">text-align</div>
            </div>
            <button onClick={handleOpenHTML}>Показать код</button>
        </>
    );
};

export { Topbar };
