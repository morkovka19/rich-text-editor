import { FC } from 'react';

import { Divider } from './components/Divider';
import FontSizeBlock from './components/FontSizeBlock';
import FontStylesBlock from './components/FontStylesBlock';
import { FontsBlock } from './components/FontsBlock';
// import { HistoryBlock } from './components/HistoryBlock';
import InsertBlock from './components/InsertBlock';
// import { TagsBlock } from './components/TagsBlock';
import TextStyleBlock from './components/TextStyleBlock';
import './styles.scss';
import { ITopbar } from './types';

const Topbar: FC<ITopbar> = () => {
    return (
        <div className="topbar">
            {/* <HistoryBlock /> */}
            <Divider />
            {/* <TagsBlock /> */}
            <Divider />
            <FontsBlock />
            <Divider />
            <FontSizeBlock />
            <Divider />
            <FontStylesBlock />
            <Divider />
            <InsertBlock />
            <Divider />
            <TextStyleBlock />
        </div>
    );
};

export { Topbar };
