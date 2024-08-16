export interface IEditor {
    initialText?: string;
    isEditable?: boolean;
    editorRef: React.RefObject<HTMLDivElement>;
}
