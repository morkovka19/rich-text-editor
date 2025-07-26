import { FC, ReactElement, useRef } from 'react';

import CloseIcon from '../../../icons/close.svg';
import { useOnClickOutside } from '../../../utils/hooks/useOnClickOutside';
import Button from '../Button';
import './styles.scss';

type PopupProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    footer?: ReactElement;
    content: ReactElement;
};

const Popup: FC<PopupProps> = ({ isOpen, onClose, title, content, footer }) => {
    if (!isOpen) return;
    const popupRef = useRef<HTMLDivElement | null>(null);
   useOnClickOutside(popupRef, onClose);
    return (
        <div className="popup">
            <div className="popup__modal" ref={popupRef}>
                <div className="popup__header">
                    <div className="popup__title">{title}</div>
                    <Button theme="icon" Icon={CloseIcon} className="popup__cancel" onClick={onClose} />
                </div>
                <div className="popup__content">{content}</div>
                <div className="popup__footer">{footer}</div>
            </div>
        </div>
    );
};

export default Popup;
