import { ChangeEvent, FC, useEffect, useReducer } from 'react';

import MinusIcon from '../../../icons/topbar/minus.svg';
import PlusIcon from '../../../icons/topbar/plus.svg';
import Button from '../Button';
import { reducer } from './helpers/reducer';
import './styles.scss';

export interface ICounterProps {
    handelUpdate: (value: number) => void;
    value: number;
}

const Counter: FC<ICounterProps> = ({ handelUpdate, value }) => {
    const [state, dispatch] = useReducer(reducer, { count: value });
    const increment = () => {
        dispatch({ type: 'increment', handleUpdate: handelUpdate });
    };
    const decrement = () => {
        dispatch({ type: 'decrement', handleUpdate: handelUpdate });
    };
    const input = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'input', value: e.target.value, handleUpdate: handelUpdate });
    };

    useEffect(() => {
        dispatch({ type: 'input', value: String(value) });
    }, [value]);

    return (
        <div className="counter">
            <Button theme="icon" Icon={MinusIcon} onClick={decrement} />
            <input className="counter__input" value={state.count} onChange={e => input(e)} />
            <Button theme="icon" Icon={PlusIcon} onClick={increment} />
        </div>
    );
};

export default Counter;
