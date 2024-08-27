import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface IEditableContentBlock {
    initialText?: string;
    isEditable?: boolean;
    setContent?: Dispatch<SetStateAction<string>>;
    editorRef?: React.RefObject<HTMLDivElement>;
    children?: ReactNode;
}
