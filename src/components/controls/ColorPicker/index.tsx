/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import min from 'lodash/min';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { baseColors } from '../../../helpers/constants';
import { useOnClickOutside } from '../../../helpers/hooks/useOnClickOutside';
import { SVGRIcon } from '../../../types';
import Button from '../Button';
import './ColorPicker.styles.scss';
import { Position } from './ColorPicker.types';
import MoveWrapper from './components/MoveWrapper';
import { convertStrToRGB, transformColor } from './helpers';
import { COLOR_FORMAT, HEIGHT, N_MAX_LINE, N_MAX_RAD, WIDTH } from './helpers/constants';

export interface IColorPickerProps {
    Icon?: SVGRIcon;
    color: string;
    handleUpdate: (value: string) => void;
}

const ColorPicker: FC<IColorPickerProps> = ({ Icon, color, handleUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [selfColor, setSelfColor] = useState(transformColor(COLOR_FORMAT.HEX, color || ''));

    const [inputColor, setInputColor] = useState(selfColor.hex);

    useEffect(() => setSelfColor(transformColor(COLOR_FORMAT.HEX, color)), [color]);

    const saturationPosition = useMemo(() => {
        const x = min([(selfColor.hsv.s / N_MAX_LINE) * WIDTH, WIDTH]);
        const y = min([((N_MAX_LINE - selfColor.hsv.v) / N_MAX_LINE) * HEIGHT, HEIGHT]);
        return {
            x,
            y,
        };
    }, [selfColor.hsv.s, selfColor.hsv.v]);

    const huePosition = useMemo(
        () => ({
            x: (selfColor.hsv.h / N_MAX_RAD) * WIDTH,
        }),
        [selfColor.hsv]
    );
    const onMoveSaturation = ({ x, y }: Position) => {
        const newHsv = {
            ...selfColor.hsv,
            s: (x / WIDTH) * N_MAX_LINE,
            v: N_MAX_LINE - (y / HEIGHT) * N_MAX_LINE,
        };
        const newColor = transformColor(COLOR_FORMAT.HSV, newHsv);
        setSelfColor(newColor);
    };
    const onMoveHue = useCallback(
        ({ x }: Position) => {
            const newHsv = { ...selfColor.hsv, h: (x / WIDTH) * N_MAX_RAD };
            const newColor = transformColor(COLOR_FORMAT.HSV, newHsv);
            setSelfColor(newColor);
        },
        [selfColor.hsv]
    );

    const onSetSelfColor = useCallback((value: string) => {
        const color = transformColor(COLOR_FORMAT.HEX, value);
        setSelfColor(color);
    }, []);

    const handleKeyDown = useCallback(
        (e: any) => {
            if (e.code === 'Enter') {
                e.preventDefault();
                const value = e.target.value;
                onSetSelfColor(value);
            }
        },
        [onSetSelfColor]
    );
    const handleBlur = useCallback(
        (e: { target: { value: string } }) => {
            const value = e.target.value;
            onSetSelfColor(value);
        },
        [onSetSelfColor]
    );
    const handleChange = useCallback((e: { target: { value: string } }) => {
        const value: string = e.target.value;
        setInputColor(value);
    }, []);

    const colorPickerRef = useRef(null);
    useOnClickOutside(colorPickerRef, () => {
        setIsOpen(false);
    });

    const colorPickerBlockRef = useRef(null);
    useOnClickOutside(colorPickerBlockRef, () => {
        setIsOpen(false);
    });

    useEffect(() => {
        setInputColor(selfColor.hex);
        handleUpdate(selfColor.hex);
    }, [selfColor.hex]);

    return (
        <div className="color-picker" ref={colorPickerRef}>
            <Button theme="select" Icon={Icon} onClick={() => setIsOpen(prev => !prev)} isOpenSelect={isOpen} />
            {isOpen && (
                <div className="color-picker__wrapper">
                    <div className="color-picker__wrapper__block" ref={colorPickerBlockRef}>
                        <div className="color-picker__input-block">
                            <label className="color-picker__input-block__label">Hex</label>
                            <input
                                className="color-picker__input-block__input"
                                value={inputColor}
                                onChange={e => handleChange(e)}
                                onBlur={e => handleBlur(e)}
                                onKeyDown={e => handleKeyDown(e)}
                            ></input>
                        </div>
                        <div className="color-picker__basic-color-block">
                            {baseColors.map(color => (
                                <Button
                                    color={color}
                                    theme="color"
                                    onClick={() =>
                                        setSelfColor(transformColor(COLOR_FORMAT.RGB, convertStrToRGB(color)))
                                    }
                                />
                            ))}
                        </div>
                        <MoveWrapper
                            children={
                                <div
                                    className="color-picker__saturation__cursor"
                                    style={{
                                        backgroundColor: selfColor.hex,
                                        left: saturationPosition.x,
                                        top: saturationPosition.y,
                                    }}
                                />
                            }
                            className="color-picker__saturation"
                            onChange={onMoveSaturation}
                            style={{
                                backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
                            }}
                        />
                        <MoveWrapper
                            className="color-picker__hue"
                            onChange={onMoveHue}
                            children={
                                <div
                                    className="color-picker__hue__cursor"
                                    style={{
                                        backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
                                        left: `${huePosition.x}px`,
                                    }}
                                />
                            }
                        />

                        <div className="color-picker__color" style={{ background: `${selfColor.hex}` }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPicker;
