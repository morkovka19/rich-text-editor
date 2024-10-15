/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable no-unsafe-optional-chaining */
import { useCallback, useMemo, useState } from 'react';

import { Button } from '../Button';
import './Select.styles.scss';
import { DropDown } from './components/DropDown';
import { ISelectProps } from './types';

export const Select = ({ selectedValue, options, onChange = () => {}, Icon }: ISelectProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = useCallback(
        (value: any) => {
            onChange(value);
            setIsOpen(false);
        },
        [onChange]
    );

    const selectedOption = useMemo(() => options.find(item => item.value === selectedValue), [options, selectedValue]);
    return (
        <>
            <Button
                label={selectedOption?.label}
                onClick={() => setIsOpen(prev => !prev)}
                isSelect
                Icon={Icon || selectedOption?.Icon}
                isSelectOpen={isOpen}
            />
            {isOpen && (
                <DropDown>
                    <ul>
                        {options.map((item, i) => (
                            <li key={i} className="select__item">
                                <Button
                                    label={item.label}
                                    Icon={item.Icon}
                                    onClick={() => handleChange(item.value)}
                                    isSelectOption
                                />
                            </li>
                        ))}
                    </ul>
                </DropDown>
            )}
        </>
    );
};
