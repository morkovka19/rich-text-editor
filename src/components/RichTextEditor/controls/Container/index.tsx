import { forwardRef } from 'react';

import './Container.styles.scss';
import { IContainerProps } from './Container.types';

const Container = forwardRef<HTMLDivElement, IContainerProps>(({ children, ...props }, ref) => {
    return (
        <div className="container" ref={ref} {...props}>
            {children}
        </div>
    );
});

export { Container };
export type { IContainerProps };
