/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, type ReactNode, useRef } from 'react';
import { type Position } from 'react-beautiful-dnd';

import { calculateZoomLevel, clamp } from '../helpers';

interface MoveWrapperProps {
    className: string;
    onChange: (position: Position) => void;
    children: ReactNode;
    style?: React.CSSProperties;
}

const MoveWrapper: FC<MoveWrapperProps> = ({ className, onChange, children, style }: MoveWrapperProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const draggedRef = useRef(false);

    const move = (e: any) => {
        if (divRef.current) {
            const { current: div } = divRef;
            const { width, height, left, top } = div.getBoundingClientRect();
            const zoom = calculateZoomLevel(div);
            const x = clamp(e.clientX / zoom - left, width, 0);
            const y = clamp(e.clientY / zoom - top, height, 0);
            onChange({ x, y });
        }
    };

    const onMouseDown = (e: any): void => {
        if (e.button !== 0) {
            return;
        }

        move(e);

        const onMouseMove = (_e: any): void => {
            draggedRef.current = true;
            move(_e);
        };

        const onMouseUp = (_e: any): void => {
            document.removeEventListener('mousemove', onMouseMove, false);
            document.removeEventListener('mouseup', onMouseUp, false);

            move(_e);
            draggedRef.current = false;
        };

        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('mouseup', onMouseUp, false);
    };

    return (
        <div className={className} onMouseDown={onMouseDown} ref={divRef} style={style}>
            {children}
        </div>
    );
};

export default MoveWrapper;
