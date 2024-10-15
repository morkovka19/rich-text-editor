import ArrowIcon from '../../../icons/arrow.svg';
import './styles.scss';
import { ButtonProps } from './types';

export const Button = ({
    Icon,
    label,
    onClick,
    isRound = true,
    isSelect = false,
    isSelectOpen = false,
    isSelectOption = false,
}: ButtonProps) => (
    <button
        className={`button-topbar ${isRound && 'button-topbar_round'} ${isSelectOption && `button-topbar__list-item`}`}
        onClick={onClick}
    >
        {
            <>
                {Icon && <Icon className="button-topbar__icon" />}
                <span className="button-topbar__span">{label}</span>
                {isSelect && (
                    <ArrowIcon
                        className={`button-topbar__icon${isSelectOpen ? '_active' : ''} button-topbar__icon_select`}
                    />
                )}
            </>
        }
    </button>
);
