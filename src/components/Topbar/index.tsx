import { FC } from 'react';

import './Topbar.styles.scss';
import { ITopbar } from './Topbar.types';
import { Divider } from './components/Divider';
import { FontsBlock } from './components/FontsBlock';
import { HistoryBlock } from './components/HistoryBlock';
import { TypeBlock } from './components/TypeBlock';
import { FontOptionsValuesLabels, TypeOptionsValues } from './helpers/constants';

const Topbar: FC<ITopbar> = () => {
    return (
        <div className="topbar">
            <HistoryBlock />
            <Divider />
            <TypeBlock activeValueType={TypeOptionsValues.NORMAL} onChange={() => {}} />
            <Divider />
            <FontsBlock activeValueFont={FontOptionsValuesLabels.ARIAL} onChange={() => {}} />
            <Divider />
        </div>
    );
};

export { Topbar };
