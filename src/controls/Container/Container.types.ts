import { HTMLProps, ReactNode } from 'react';

interface IContainerProps extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
}

export type { IContainerProps };
