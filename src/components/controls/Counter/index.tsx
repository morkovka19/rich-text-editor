import { ChangeEvent, FC, useReducer } from 'react';

import MinusIcon from '../../../icons/topbar-font-size/minus.svg';
import PlusIcon from '../../../icons/topbar-font-size/plus.svg';
import Button from '../Button';
import './Counter.styles.scss';
import { initialState, reducer } from './helpers/reducer';

export interface ICounterProps {
    handelUpdate: (value: number) => void;
}

const Counter: FC<ICounterProps> = ({ handelUpdate }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const increment = () => {
        dispatch({ type: 'increment' });
        handelUpdate(state.count);
    };
    const decrement = () => {
        dispatch({ type: 'decrement' });
        handelUpdate(state.count);
    };
    const input = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'input', value: e.target.value });
        handelUpdate(state.count);
    };

    return (
        <div className="counter">
            <Button theme="icon" Icon={MinusIcon} onClick={decrement} />
            <input className="counter__input" value={state.count} onChange={e => input(e)} />
            <Button theme="icon" Icon={PlusIcon} onClick={increment} />
        </div>
    );
};

export default Counter;
