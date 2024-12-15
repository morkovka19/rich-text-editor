import { FC, useCallback, useRef, useState } from 'react';

import { useOnClickOutside } from '../../../scripts/hooks/useOnClickOutside';
import { SVGRIcon } from '../../../types';
import Button from '../Button';
import './Select.styles.scss';
import { IOption } from './Select.types';

export interface ISelectProps {
    options: IOption[];
    Icon?: SVGRIcon;
}
const Select: FC<ISelectProps> = ({ options, Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = useCallback(() => setIsOpen(prev => !prev), []);

    const [activeOption, setActiveOption] = useState(options[0]);

    const handleClickOption = useCallback((option: IOption) => {
        setActiveOption(option);
        setIsOpen(false);
    }, []);

    const dropdowmRef = useRef(null);

    useOnClickOutside(dropdowmRef, () => setIsOpen(false));

    return (
        <div className="select" ref={dropdowmRef}>
            <Button
                theme="select"
                onClick={handleClick}
                text={activeOption.label}
                Icon={activeOption?.Icon || Icon}
                isOpenSelect={isOpen}
            />
            {isOpen && (
                <div className="select__dropdown">
                    <ul>
                        {options.map(option => (
                            <li>
                                <Button
                                    Icon={option?.Icon}
                                    text={option.label}
                                    theme="text"
                                    onClick={() => handleClickOption(option)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Select;
