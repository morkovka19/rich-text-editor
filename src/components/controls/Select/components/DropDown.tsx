import { ReactNode } from 'react';

import '../Select.styles.scss';

export interface IDropDown {
    children?: ReactNode | ReactNode[];
}
export const DropDown = ({ children }: IDropDown) => <div className="select__dropdown">{children}</div>;
