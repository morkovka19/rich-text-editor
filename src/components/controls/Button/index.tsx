/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback } from 'react';

import Arrow from '../../../icons/arrow.svg';
import { SVGRIcon } from '../../../types';
import './Button.styles.scss';

type ButtonTheme = 'text' | 'icon' | 'select';

export interface IButtonProps {
    theme: ButtonTheme;
    text?: string;
    onClick?: () => void;
    disable?: boolean;
    iconAfter?: boolean;
    Icon?: SVGRIcon;
    isOpenSelect?: boolean;
}

const Button: FC<IButtonProps> = ({
    theme,
    onClick,
    text,
    disable = false,
    Icon,
    isOpenSelect = false,
    iconAfter = false,
}) => {
    const handleClickSelect = useCallback(() => {
        if (onClick) onClick();
    }, [onClick]);

    return (
        <button className="button" onClick={theme === 'select' ? handleClickSelect : onClick} disabled={disable}>
            {Icon && !iconAfter && <Icon className="button__icon" />}
            {text && <span className="buttom__name">{text}</span>}
            {Icon && iconAfter && <Icon className="button__icon button__icon_after" />}
            {theme === 'select' && <Arrow className={`button__arrow ${isOpenSelect && 'button__arrow_open'}`} />}
        </button>
    );
};

export default Button;
