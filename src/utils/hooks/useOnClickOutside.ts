/* eslint-disable @typescript-eslint/no-explicit-any */
import { type RefObject, type SetStateAction, useEffect } from 'react';

export const useOnClickOutside = (ref: RefObject<Element>, handler: SetStateAction<any>) => {
    useEffect(() => {
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target as Node)) return;
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchend', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchend', listener);
        };
    }, [ref, handler]);
};
