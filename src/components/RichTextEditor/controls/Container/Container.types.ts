import { HTMLProps } from 'react';

interface IContainerProps extends HTMLProps<HTMLDivElement> {
    children: React.ReactNode;
}

export type { IContainerProps };
