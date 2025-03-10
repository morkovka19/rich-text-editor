import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { NodeKey } from '../../classes/LexicalNode/types';
import { useEditor } from '../../context/LexicalContext';
import CancelIcon from '../../icons/cancel.svg';
import ConfirmIcon from '../../icons/confirm.svg';
import DeleteIcon from '../../icons/delete.svg';
import EditIcon from '../../icons/edit.svg';
import { LINK_START } from '../../utils/constants';
import { useOnClickOutside } from '../../utils/hooks/useOnClickOutside';
import Button from '../controls/Button';
import './styles.scss';

interface ILinkEditorProps {
    value?: string;
    onClose: () => void;
    activeNode: HTMLElement;
    onChange: (key: NodeKey, href?: string) => void;
}

const LinkEditor = ({ value, onClose, activeNode, onChange }: ILinkEditorProps) => {
    const [isActive, setIsActive] = useState(false);
    const [inputValue, setInputValue] = useState(value || LINK_START);
    const key = useMemo(() => activeNode?.id, [activeNode]);
    const linkEditorBlockRef = useRef<HTMLDivElement>(null);

    const { editor } = useEditor();

    useLayoutEffect(() => {
        editor.registerLinkEditorObservers();
    }, [editor]);

    useOnClickOutside(linkEditorBlockRef, () => {
        onClose();
    });
    const inputRef = useRef<HTMLInputElement>(null);

    if (!activeNode) return;
    return (
        <>
            {createPortal(
                <>
                    <div
                        className="link-editor"
                        ref={linkEditorBlockRef}
                        onClick={event => {
                            event.stopPropagation();
                        }}
                        contentEditable={false}
                    >
                        {isActive ? (
                            <div
                                className="link-editor__main-block"
                                onClick={event => {
                                    event.stopPropagation();
                                }}
                            >
                                <input
                                    type="url"
                                    ref={inputRef}
                                    value={inputValue}
                                    className="link-editor__text link-editor__input"
                                    onChange={event => {
                                        event.stopPropagation();
                                        setInputValue(event.target.value);
                                        event.target.focus();
                                    }}
                                    placeholder={!value ? LINK_START : ''}
                                    onClick={event => {
                                        event.stopPropagation();
                                    }}
                                />
                                <div className="link-editor__buttons-block">
                                    <Button
                                        Icon={CancelIcon}
                                        theme="icon"
                                        onClick={event => {
                                            event.stopPropagation();
                                            setInputValue(value || LINK_START);
                                            setIsActive(false);
                                        }}
                                        className="link-editor__button link-editor__button_mini"
                                    />
                                    <Button
                                        Icon={ConfirmIcon}
                                        theme="icon"
                                        className="link-editor__button link-editor__button_mini"
                                        onClick={event => {
                                            event.stopPropagation();
                                            onChange(key, inputValue);
                                            setIsActive(false);
                                        }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="link-editor__main-block" onClick={event => event.stopPropagation()}>
                                <a
                                    href={value || 'https://'}
                                    target="_blank"
                                    className="link-editor__text link-editor__link"
                                    contentEditable={false}
                                >
                                    {inputValue || 'https://'}
                                </a>
                                <div className="link-editor__buttons-block">
                                    <Button
                                        onClick={event => {
                                            event.stopPropagation();

                                            setIsActive(true);
                                        }}
                                        Icon={EditIcon}
                                        theme="icon"
                                        className="link-editor__button"
                                    />
                                    <Button
                                        onClick={event => {
                                            event.stopPropagation();
                                            onChange(key);
                                        }}
                                        Icon={DeleteIcon}
                                        theme="icon"
                                        className="link-editor__button"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </>,
                activeNode
            )}
        </>
    );
};

export default LinkEditor;
