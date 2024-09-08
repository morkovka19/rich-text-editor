import { Dispatch, ReactNode, RefObject, SetStateAction } from 'react';

export interface IContentEditableBlock {
    initialText?: string;
    isEditable?: boolean;
    setContent?: Dispatch<SetStateAction<string>>;
    editorRef?: RefObject<HTMLDivElement>;
    children?: ReactNode;
}
