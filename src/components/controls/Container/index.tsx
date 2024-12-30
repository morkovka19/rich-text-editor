import { HTMLProps, ReactNode, forwardRef } from 'react';

import './Container.styles.scss';

export interface IContainerProps extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
}

const Container = forwardRef<HTMLDivElement, IContainerProps>(({ children, ...props }, ref) => {
    return (
        <div className="container" ref={ref} {...props}>
            {children}
        </div>
    );
});

export { Container };
