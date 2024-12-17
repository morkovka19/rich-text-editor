import { FC } from 'react';

import './Topbar.styles.scss';
import { ITopbar } from './Topbar.types';
import { Divider } from './components/Divider';
import FontSizeBlock from './components/FontSizeBlock';
import FontStylesBlock from './components/FontStylesBlock';
import { FontsBlock } from './components/FontsBlock';
import { HistoryBlock } from './components/HistoryBlock';
import InsertBlock from './components/InsertBlock';
import { TypeBlock } from './components/TypeBlock';

const Topbar: FC<ITopbar> = () => {
    return (
        <div className="topbar">
            <HistoryBlock />
            <Divider />
            <TypeBlock />
            <Divider />
            <FontsBlock />
            <Divider />
            <FontSizeBlock />
            <Divider />
            <FontStylesBlock />
            <Divider />
            <InsertBlock />
        </div>
    );
};

export { Topbar };
