/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';

import Arrow from '../../../icons/arrow.svg';
import { SVGRIcon } from '../../../types';
import './Button.styles.scss';

type ButtonTheme = 'text' | 'icon' | 'select' | 'color';

export interface IButtonProps {
    theme: ButtonTheme;
    text?: string;
    onClick?: () => void;
    disable?: boolean;
    iconAfter?: boolean;
    Icon?: SVGRIcon;
    isOpenSelect?: boolean;
    color?: string;
    isPartSelect?: boolean;
}

const Button: FC<IButtonProps> = ({
    theme,
    onClick,
    text,
    disable = false,
    Icon,
    isOpenSelect = false,
    iconAfter = false,
    color,
    isPartSelect,
}) => {
    return (
        <button
            className={`button ${theme === 'text' && 'button_text'} ${theme === 'icon' && 'button_icon'} ${theme === 'icon' && 'button_select'} ${theme === 'color' && 'button_color'}`}
            onClick={onClick}
            disabled={disable}
            style={theme === 'color' && color ? { background: color } : {}}
        >
            {Icon && !iconAfter && <Icon className="button__icon" />}
            {text && <span className={`button__name ${isPartSelect && 'button__name_visible'}`}>{text}</span>}
            {Icon && iconAfter && <Icon className="button__icon button__icon_after" />}
            {theme === 'select' && <Arrow className={`button__arrow ${isOpenSelect && 'button__arrow_open'}`} />}
        </button>
    );
};

export default Button;
