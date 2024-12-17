import { FC, useRef, useState } from 'react';

import { baseColors } from '../../../scripts/constants';
import { useOnClickOutside } from '../../../scripts/hooks/useOnClickOutside';
import { SVGRIcon } from '../../../types';
import Button from '../Button';
import './ColorPicker.styles.scss';

interface IColorPickerProps {
    Icon: SVGRIcon;
}

const ColorPicker: FC<IColorPickerProps> = ({ Icon }) => {
    const [isOpen, setIsOpen] = useState(false);

    const colorPickerRef = useRef(null);
    useOnClickOutside(colorPickerRef, () => setIsOpen(false));
    return (
        <div className="color-picker" ref={colorPickerRef}>
            <Button theme="select" Icon={Icon} onClick={() => setIsOpen(prev => !prev)} isOpenSelect={isOpen} />
            {isOpen && (
                <div className="color-picker__wrapper">
                    <div className="color-picker__wrapper__block">
                        <div className="color-picker__input-block">
                            <label className="color-picker__input-block__label">Hex</label>
                            <input className="color-picker__input-block__input"></input>
                        </div>
                        <div className="color-picker__basic-color-block">
                            {baseColors.map(color => (
                                <Button color={color} theme="color" />
                            ))}
                        </div>
                        <div className="color-picker__saturation">
                            <div className="color-picker__saturation__cursor" />
                        </div>
                        <div className="color-picker__hue">
                            <div className="color-picker__hue__cursor" />
                        </div>
                        <div className="color-picker__color" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
