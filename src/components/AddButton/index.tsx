import { useState } from 'react';

import { insertOptions } from '../../utils/constants';
import Button from '../controls/Button';
import './styles.scss';

export const AddButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div
                className={`add-button__top-selection ${isOpen ? 'add-button__top-selection_active' : 'add-button__top-selection_not-active'}`}
            >
                <ul>
                    {insertOptions.map(option => (
                        <li>
                            <Button Icon={option?.Icon} theme="text" isPartSelect />
                        </li>
                    ))}
                </ul>
            </div>

            <button className="add-button" onClick={() => setIsOpen(prev => !prev)}>
                +
            </button>
        </>
    );
};
