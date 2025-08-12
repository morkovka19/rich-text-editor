import { FC, HTMLProps, ReactNode } from 'react';

import './styles.scss';

export interface IButtonsContainerProps extends HTMLProps<HTMLDivElement> {
    children?: ReactNode | ReactNode[];
}

export const ButtonsContainer: FC<IButtonsContainerProps> = ({ children }) => (
    <div className="buttons-container">{children}</div>
);
