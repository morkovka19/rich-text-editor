/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, MouseEventHandler } from 'react';

import Arrow from '../../../icons/arrow.svg';
import { SVGRIcon } from '../../../types';
import './Button.styles.scss';

type ButtonTheme = 'text' | 'icon' | 'select' | 'color';

export interface IButtonProps {
    theme: ButtonTheme;
    text?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    iconAfter?: boolean;
    Icon?: SVGRIcon;
    isOpenSelect?: boolean;
    color?: string;
    isPartSelect?: boolean;
    title?: string;
    isActive?: boolean;
    className?: string;
}

const Button: FC<IButtonProps> = ({
    theme,
    onClick,
    text,
    disabled = false,
    Icon,
    isOpenSelect = false,
    iconAfter = false,
    color,
    isPartSelect,
    title,
    isActive = false,
    className,
}) => {
    return (
        <button
            className={`button ${theme === 'text' ? 'button_text' : null} ${theme === 'icon' ? 'button_icon' : null} ${theme === 'icon' ? 'button_select' : ''} ${theme === 'color' ? 'button_color' : ''} ${isActive ? 'button_active' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={theme === 'color' && color ? { background: color } : {}}
            title={title}
        >
            {Icon && !iconAfter && <Icon className="button__icon" />}
            {text && <span className={`button__name ${isPartSelect && 'button__name_visible'}`}>{text}</span>}
            {Icon && iconAfter && <Icon className="button__icon button__icon_after" />}
            {theme === 'select' && <Arrow className={`button__arrow ${isOpenSelect && 'button__arrow_open'}`} />}
        </button>
    );
};

export default Button;
