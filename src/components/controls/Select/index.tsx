/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SVGRIcon } from '../../../types';
import { useOnClickOutside } from '../../../utils/hooks/useOnClickOutside';
import Button from '../Button';
import './Select.styles.scss';
import { IOption } from './Select.types';

export interface ISelectProps {
    options: IOption[];
    Icon?: SVGRIcon;
    isStaticName?: boolean;
    name?: string;
    onChange?: (value: any) => void;
    value?: IOption;
}
const Select: FC<ISelectProps> = ({ options, Icon, name, onChange, value, isStaticName = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleClick = useCallback(() => setIsOpen(prev => !prev), []);

    useEffect(() => {
        if (value?.label !== activeOption.label && value) setActiveOption(value);
    }, [value]);

    const [activeOption, setActiveOption] = useState(value || options[0]);

    const handleClickOption = useCallback(
        (option: IOption) => {
            setActiveOption(option);
            setIsOpen(false);
            if (onChange) onChange(option.value);
        },
        [onChange]
    );

    const dropdowmRef = useRef(null);

    useOnClickOutside(dropdowmRef, () => setIsOpen(false));

    const nameButton = useMemo(() => {
        if (Icon && activeOption.label.length > 6) return `${activeOption.label.slice(0, 6)}...`;
        if (activeOption.label.length > 6) return `${activeOption.label.slice(0, 6)}...`;
        return activeOption.label;
    }, [Icon, activeOption.label]);

    return (
        <div className="select" ref={dropdowmRef}>
            <Button
                theme="select"
                onClick={handleClick}
                text={isStaticName ? name : nameButton}
                Icon={!isStaticName && activeOption?.Icon ? activeOption?.Icon : Icon}
                isOpenSelect={isOpen}
            />
            {isOpen && (
                <div className="select__dropdown">
                    <ul className="select__list">
                        {options.map((option, i) => (
                            <li key={i}>
                                <Button
                                    Icon={option?.Icon}
                                    text={option.label}
                                    theme="text"
                                    onClick={() => handleClickOption(option)}
                                    isPartSelect
                                    isActive={Boolean(option.label === activeOption?.label)}
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
