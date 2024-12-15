import { FC } from 'react';

import MinusIcon from '../../../icons/topbar-font-size/minus.svg';
import PlusIcon from '../../../icons/topbar-font-size/plus.svg';
import Button from '../Button';
import './Counter.styles.scss';

export interface ICounterProps {}

const Counter: FC<ICounterProps> = () => {
    return (
        <div className="counter">
            <Button theme="icon" Icon={MinusIcon} />
            <input className="counter__input" />
            <Button theme="icon" Icon={PlusIcon} />
        </div>
    );
};

export default Counter;
