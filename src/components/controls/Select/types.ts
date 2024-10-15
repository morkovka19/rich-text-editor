/* eslint-disable @typescript-eslint/no-explicit-any */
import { SVGRIcon } from '../Button/types';

export interface IOption {
    value: string;
    label: string;
    selected?: boolean;
    disabled?: boolean;
    Icon?: SVGRIcon;
}

export interface ISelectProps {
    id?: string;
    name?: string;
    options: IOption[];
    selectedValue?: string;
    onChange?: (value: any) => void;
    Icon?: SVGRIcon;
}
