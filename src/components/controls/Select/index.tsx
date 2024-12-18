import { FC, useCallback, useMemo, useRef, useState } from 'react';

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

    const nameButton = useMemo(() => {
        if (Icon && activeOption.label.length > 5) return `${activeOption.label.slice(0, 5)}...`;
        if (activeOption.label.length > 7) return `${activeOption.label.slice(0, 7)}...`;
        return activeOption.label;
    }, [Icon, activeOption.label]);

    return (
        <div className="select" ref={dropdowmRef}>
            <Button
                theme="select"
                onClick={handleClick}
                text={nameButton}
                Icon={activeOption?.Icon || Icon}
                isOpenSelect={isOpen}
            />
            {isOpen && (
                <div className="select__dropdown">
                    <ul className="select__list">
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
